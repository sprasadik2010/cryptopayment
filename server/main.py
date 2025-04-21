from collections import deque
from sqlalchemy import or_
import os
from fastapi import FastAPI, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import cast, String
from database import SessionLocal, engine
from models import Base, Member, ProfitClub
from utils import generate_verification_token, verify_token
from email_service import send_verification_email
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import socket

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # connect to a dummy IP to get your local IP
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

local_ip = get_local_ip()
# Initialize FastAPI app
app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        f"http://localhost:5173",
        f"http://127.0.0.1:5173",
        f"http://{local_ip}:5173",  # <-- this one is for mobile access
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Create database tables
Base.metadata.create_all(bind=engine)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings using environment variables
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key_here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Pydantic models
class MemberCreate(BaseModel):
    membername: str
    email: EmailStr
    username: str
    password: str
    parentid: int
    side: int
    createdby: int
    parentname:str
    createdbyname:str

class MemberResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    username: str
    parentid: int
    position: int
    is_verified: bool
    is_active: bool
    createdby: int
    createdon: datetime
    parentname:Optional[str]
    role:str

class MemberLogin(BaseModel):
    username: str
    password: str

class VerifyEmail(BaseModel):
    token: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class UserActivateRequest(BaseModel):
    is_active: bool

class ProfitClubResponse(BaseModel):
   id:int
   releasedate:datetime
   amount:float 

class ProfitClubRequest(BaseModel):
   releasedate:datetime
   amount:float 

# Dependency for database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/register/")
def register(member: MemberCreate, db: Session = Depends(get_db)):
    side_bit = str(member.side)

    existing_member = db.query(Member).filter(
        (Member.username == member.username)
    ).first()

    if existing_member:
        raise HTTPException(status_code=400, detail="Email or Username already registered.")

    try:
        hashed_password = pwd_context.hash(member.password)
        verification_token = generate_verification_token(member.email, member.username)
        parentname,createdbyname = getsomemembers(member.parentid, member.createdby, db)
        new_member = Member(
            membername=member.membername,
            email=member.email,
            username=member.username,
            password=hashed_password,
            parentid=member.parentid,
            side=str(member.side),
            is_verified=False,
            is_active=False,
            verification_token=verification_token,
            createdby=member.createdby,
            parentname=parentname,
            createdbyname=createdbyname
        )

        db.add(new_member)
        db.commit()
        db.refresh(new_member)

        send_verification_email(member.email, verification_token)

        return {"message": "Verification email sent. Check your inbox.", "user_id": new_member.id}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.get("/verify/{token}")
def verify_email(token: str, db: Session = Depends(get_db)):
    email, username = verify_token(token)
    
    if not email or not username:
        raise HTTPException(status_code=400, detail="Invalid or expired token.")

    member = db.query(Member).filter(Member.email == email, Member.username == username, Member.verification_token == token).first()
    if not member:
        raise HTTPException(status_code=400, detail="User not found.")
    
    if member.is_verified:
        return {"message": "Email already verified."}    
    
    member.verification_token = None  # Clear token after verification
    member.is_verified = True
    db.commit()

    return {"message": "Email verified successfully!"}

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/login/", response_model=TokenResponse)
def login(member: MemberLogin, db: Session = Depends(get_db)):
    db_member = db.query(Member).filter(Member.username == member.username).first()
    if not db_member or not pwd_context.verify(member.password, db_member.password):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    if not db_member.is_verified:
        raise HTTPException(status_code=400, detail="Email is not verified")
    access_token = create_access_token(data={"sub": db_member.username})
    return {"access_token": access_token, "token_type": "bearer"}

def getsomemembers(parentid: int, createdbyid: int, db: Session):
    members = db.query(Member).filter(
        or_(Member.id == parentid, Member.id == createdbyid)
    ).all()

    if not members:
        raise HTTPException(status_code=400, detail="No such member(s) found.")

    parentname = createdbyname = None

    for m in members:
        if m.id == parentid:
            parentname = m.membername
        if m.id == createdbyid:
            createdbyname = m.membername

    # If both ids are same, set both names to same value
    if parentid == createdbyid:
        if parentname is None:
            raise HTTPException(status_code=400, detail="Invalid parent/creator ID")
        createdbyname = parentname

    # Ensure both names are resolved
    if parentname is None or createdbyname is None:
        raise HTTPException(status_code=400, detail="Could not find required member(s)")

    return parentname, createdbyname


@app.get("/getamember", response_model=MemberResponse)
def getamember(username: str = Depends(get_current_user), db: Session = Depends(get_db)):
    member = db.query(Member).filter(Member.username == username).first()
    if not member:
        raise HTTPException(status_code=404, detail="User not found")
    
    return MemberResponse(
        id=member.id,
        name=member.membername,
        email=member.email,
        username=member.username,
        parentid=member.parentid,
        position=int(member.side),
        is_verified=member.is_verified,
        is_active=member.is_active,
        createdby=member.createdby,
        createdon=member.createdon,
        parentname=member.parentname,
        createdbyname=member.createdbyname,
        role=member.role
    )

@app.get("/getallmembers", response_model=List[MemberResponse])
def get_all_members(db: Session = Depends(get_db)):
    members = db.query(Member).filter(Member.role != 'superadmin').all()
    return [
        MemberResponse(
            id=m.id,
            name=m.membername,
            email=m.email,
            username=m.username,
            parentid=m.parentid,
            position=int(m.side),
            is_verified=m.is_verified,
            is_active=m.is_active,
            createdby=m.createdby,
            createdon=m.createdon,
            parentname=m.parentname,
            createdbyname=m.createdbyname,
            role=m.role
        )
        for m in members
    ]


@app.get("/get-all-active-members", response_model=List[MemberResponse])
def get_all_members(db: Session = Depends(get_db)):
    members = db.query(Member).filter(Member.is_active, Member.role != 'superadmin').all()
    return [
        MemberResponse(
            id=m.id,
            name=m.membername,
            email=m.email,
            username=m.username,
            parentid=m.parentid,
            position=int(m.side),
            is_verified=m.is_verified,
            is_active=m.is_active,
            createdby=m.createdby,
            createdon=m.createdon,
            parentname=m.parentname,
            createdbyname=m.createdbyname,
            role=m.role
        )
        for m in members
    ]

@app.get("/children/{username}", response_model=List[MemberResponse])
def get_children(username: str, db: Session = Depends(get_db)):
    def fetch_all_children(parent_id):
        children = db.query(Member).filter(Member.parentid == parent_id, Member.role != 'superadmin').all()
        all_descendants = []
        for child in children:
            all_descendants.append(child)
            all_descendants.extend(fetch_all_children(child.id))
        return all_descendants

    parent = db.query(Member).filter(Member.username == username, Member.role != 'superadmin').first()
    if not parent:
        raise HTTPException(status_code=404, detail="User not found")

    children = fetch_all_children(parent.id)

    # Include parent in the response
    return [
        MemberResponse(
            id=member.id,
            name=member.membername,
            email=member.email,
            username=member.username,
            parentid=member.parentid,
            position=int(member.side),
            is_verified=member.is_verified,
            is_active=member.is_active,
            createdby=member.createdby,
            createdon=member.createdon,
            parentname=member.parentname,
            createdbyname=member.createdbyname,
            role=member.role
        ) for member in [parent] + children  # Adding parent to the beginning
    ]


@app.get("/leftmost/{userid}", response_model=Optional[MemberResponse])
def get_leftmost_vacant_left(userid: int, db: Session = Depends(get_db)):
    parent = db.query(Member).filter(Member.id == userid).first()
    if not parent:
        raise HTTPException(status_code=404, detail="User not found")

    current = parent

    # Traverse down the leftmost path
    while True:
        left_child = db.query(Member).filter(Member.parentid == current.id, cast(Member.side, String) == '0', Member.role != 'superadmin').first()
        if not left_child:
            # Found the first vacant left position
            return MemberResponse(
                id=current.id,
                name=current.membername,
                email=current.email,
                username=current.username,
                parentid=current.parentid,
                position=int(current.side),
                is_verified=current.is_verified,
                is_active=current.is_active,
                createdby=current.createdby,
                createdon=current.createdon,
                parentname=current.parentname,
                createdbyname=current.createdbyname,
                role=current.role
            )
        current = left_child  # Move to the next left child

@app.get("/rightmost/{userid}", response_model=Optional[MemberResponse])
def get_rightmost_vacant(userid: int, db: Session = Depends(get_db)):
    parent = db.query(Member).filter(Member.id == userid, Member.role != 'superadmin').first()
    if not parent:
        raise HTTPException(status_code=404, detail="User not found")

    current = parent

    # Traverse down the rightmost path
    while True:
        right_child = db.query(Member).filter(Member.parentid == current.id, cast(Member.side, String) == '1', Member.role != 'superadmin').first()
        if not right_child:
            # Found the first vacant right position
            return MemberResponse(
                id=current.id,
                name=current.membername,
                email=current.email,
                username=current.username,
                parentid=current.parentid,
                position=int(current.side),
                is_verified=current.is_verified,
                is_active=current.is_active,
                createdby=current.createdby,
                createdon=current.createdon,
                parentname=current.parentname,
                createdbyname=current.createdbyname,
                role=current.role
            )
        current = right_child  # Move to the next right child

@app.get("/left-descendants/{user_id}", response_model=List[MemberResponse])
def get_left_descendants(user_id: int, db: Session = Depends(get_db)):
    parent = db.query(Member).filter(Member.id == user_id, Member.role != 'superadmin').first()
    if not parent:
        raise HTTPException(status_code=404, detail="User not found")

    left_descendants = []
    queue = []

    # Only add left child of the given user_id to start traversal
    left_child = db.query(Member).filter(Member.parentid == user_id, cast(Member.side, String) == '0', Member.role != 'superadmin').first()
    if left_child:
        queue.append(left_child)

    while queue:
        current = queue.pop(0)
        left_descendants.append(MemberResponse(
            id=current.id,
            name=current.membername,
            email=current.email,
            username=current.username,
            parentid=current.parentid,
            position=int(current.side),
            is_verified=current.is_verified,
            is_active=current.is_active,
            createdby=current.createdby,
            createdon=current.createdon,
            parentname=current.parentname,
            createdbyname=current.createdbyname,
            role=current.role
        ))

        # Include both left & right children of this left-subtree member
        children = db.query(Member).filter(Member.parentid == current.id, Member.role != 'superadmin').all()
        queue.extend(children)  # Add both left and right children

    return left_descendants

@app.get("/right-descendants/{user_id}", response_model=List[MemberResponse])
def get_right_descendants(user_id: int, db: Session = Depends(get_db)):
    parent = db.query(Member).filter(Member.id == user_id, Member.role != 'superadmin').first()
    if not parent:
        raise HTTPException(status_code=404, detail="User not found")

    right_descendants = []
    queue = []

    # Only add right child of the given user_id to start traversal
    right_child = db.query(Member).filter(Member.parentid == user_id, cast(Member.side, String) == '1', Member.role != 'superadmin').first()
    if right_child:
        queue.append(right_child)

    while queue:
        current = queue.pop(0)
        right_descendants.append(MemberResponse(
            id=current.id,
            name=current.membername,
            email=current.email,
            username=current.username,
            parentid=current.parentid,
            position=int(current.side),
            is_verified=current.is_verified,
            is_active=current.is_active,
            createdby=current.createdby,
            createdon=current.createdon,
            parentname=current.parentname,
            createdbyname=current.createdbyname,
            role=current.role
        ))

        # Include both left & right children of this right-subtree member
        children = db.query(Member).filter(Member.parentid == current.id, Member.role != 'superadmin').all()
        queue.extend(children)

    return right_descendants


@app.patch("/activate-deactivate-user/{username}")
def activatedeactivateuser(
    username: str,
    request: UserActivateRequest,
    db: Session = Depends(get_db)
):
    existing_member = db.query(Member).filter(Member.username == username, Member.role != 'superadmin').first()
    
    if not existing_member:
        raise HTTPException(status_code=400, detail="User not found.")

    try:
        existing_member.is_active = request.is_active
        db.commit()
        db.refresh(existing_member)

        return {"message": "User updated", "User Name": existing_member.username, "is_active": existing_member.is_active}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")

@app.post("/addprofitclub/")
def addprofitclub(pc: ProfitClubRequest, db: Session = Depends(get_db)):
    try:
        new_profitclub = ProfitClub(
            releasedate=pc.releasedate,
            amount=pc.amount
        )

        db.add(new_profitclub)
        db.commit()
        db.refresh(new_profitclub)
        return {"message": "ProfitClub  added"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Adding ProfitClub failed: {str(e)}")


@app.get("/getallprofitclubs", response_model=List[ProfitClubResponse])
def get_all_profitclubs(db: Session = Depends(get_db)):
    ProfitClubs = db.query(ProfitClub).all()
    return [
        ProfitClubResponse(
            id=pc.id,
            releasedate=pc.releasedate,
            amount=pc.amount
        )
        for pc in ProfitClubs
    ]


@app.post("/logout/")
def logout():
    return {"message": "Logout successful. Clear the token on the client side."}
