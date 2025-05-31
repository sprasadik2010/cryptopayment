from collections import deque
from sqlalchemy import or_
import os
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import cast, String
from database import SessionLocal, engine
from models import Base, Member, ProfitClub, Withdrawals
from utils import generate_verification_token, verify_token
from email_service import send_verification_email
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import socket
from uuid import uuid4
import shutil
from gdrivefuncs.gdrivefunctions import upload_file_to_drive
import traceback

from datetime import datetime, date
app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:5173"],
    allow_origin_regex=r"(https://.*\.onrender\.com|http://localhost:\d+)",
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
    phone:str

class MemberResponse(BaseModel):
    id: int
    name: Optional[str] = None
    email: EmailStr
    username: Optional[str] = None
    parentid: Optional[int] = None
    position: Optional[int] = None
    is_verified: bool
    is_active: bool
    createdby: Optional[int] = None
    createdon: datetime
    parentname: Optional[str] = None
    createdbyname: Optional[str] = None
    role: str
    activationhistory: Optional[str] = None
    paid: bool
    paidamount: Optional[float] = None
    paymentdate: Optional[datetime] = None
    paymentproof: Optional[str] = None
    phone: Optional[str] = None

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

class WithdrawalResponse(BaseModel):
   id:int
   userid:int
   username:Optional[str]
   name:Optional[str]
   date:datetime
   amount:float 
   is_approved:bool
   approvaldate:Optional[datetime] = None
   class Config:
        from_attributes = True

class WithdrawalRequest(BaseModel):
   userid:int
   amount:float 
class WithdrawalApproveRequest(BaseModel):
    is_approved: bool

# class UserPaymentRequest(BaseModel):
#     paid: bool
#     paidamount = float
#     paymentdate = datetime


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
            createdbyname=createdbyname,
            phone=member.phone
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
        role=member.role,
        activationhistory=member.activationhistory,
        paid=member.paid,
        paidamount=member.paidamount,
        paymentdate=member.paymentdate,
        paymentproof=member.paymentproof,
        phone=member.phone
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
            role=m.role,
            activationhistory=m.activationhistory,
            paid=m.paid,
            paidamount=m.paidamount,
            paymentdate=m.paymentdate,
            paymentproof=m.paymentproof,
            phone=m.phone
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
            role=m.role,
            activationhistory=m.activationhistory,
            paid=m.paid,
            paidamount=m.paidamount,
            paymentdate=m.paymentdate,
            paymentproof=m.paymentproof,
            phone=m.phone
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
            role=member.role,
            activationhistory=member.activationhistory,
            paid=member.paid,
            paidamount=member.paidamount,
            paymentdate=member.paymentdate,
            paymentproof=member.paymentproof,
            phone=member.phone
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
                role=current.role,
            activationhistory=current.activationhistory,
            paid=current.paid,
            paidamount=current.paidamount,
            paymentdate=current.paymentdate,
            paymentproof=current.paymentproof,
            phone=current.phone
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
                role=current.role,
            activationhistory=current.activationhistory,
            paid=current.paid,
            paidamount=current.paidamount,
            paymentdate=current.paymentdate,
            paymentproof=current.paymentproof,
            phone=current.phone
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
            role=current.role,
            activationhistory=current.activationhistory,
            paid=current.paid,
            paidamount=current.paidamount,
            paymentdate=current.paymentdate,
            paymentproof=current.paymentproof,
            phone=current.phone
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
            role=current.role,
            activationhistory=current.activationhistory,
            paid=current.paid,
            paidamount=current.paidamount,
            paymentdate=current.paymentdate,
            paymentproof=current.paymentproof,
            phone=current.phone
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

@app.get("/first-level-members/", response_model=List[MemberResponse])
def first_level_members(db: Session = Depends(get_db)):
    try:
        # Get members who were created by someone (not superadmin, id > 1)
        members = db.query(Member).filter(
            Member.createdby > 1,
            Member.username != 'superadmin'
        ).all()

        return [
            MemberResponse(
                id=m.id,
                name=m.membername,
                email=m.email,
                username=m.username,
                parentid=m.parentid,
                position=int(m.side) if m.side is not None else 0,
                is_verified=m.is_verified,
                is_active=m.is_active,
                createdby=m.createdby,
                createdon=m.createdon,
                parentname=m.parentname,
                createdbyname=m.createdbyname,
                role=m.role,
            activationhistory=m.activationhistory,
            paid=m.paid,
            paidamount=m.paidamount,
            paymentdate=m.paymentdate,
            paymentproof=m.paymentproof,
            phone=m.phone
            )
            for m in members
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/second-level-members/", response_model=List[MemberResponse])
def get_second_level_members(db: Session = Depends(get_db)):
    
    
    first_level_members = db.query(Member).filter(
            Member.createdby > 1,
            Member.username != 'superadmin'
        ).all()
    # first_level_members = db.query(Member).filter(Member.role != 'superadmin').all()

    second_level_members = []

    for member in first_level_members:
        # For each first-level member, fetch their direct children (second-level)
        second_level_members.extend(db.query(Member).filter(Member.createdby == member.id, Member.role != 'superadmin').all())

    # Return the second-level members as MemberResponse
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
            role=m.role,
            activationhistory=m.activationhistory,
            paid=m.paid,
            paidamount=m.paidamount,
            paymentdate=m.paymentdate,
            paymentproof=m.paymentproof,
            phone=m.phone
        )
        for m in second_level_members
    ]


@app.get("/third-level-members/", response_model=List[MemberResponse])
def get_third_level_members(db: Session = Depends(get_db)):
    # Fetch all second-level members (those who are children of first-level members)
    first_level_members = db.query(Member).filter(
        Member.createdby > 1,
        Member.username != 'superadmin'
    ).all()
    # first_level_members = db.query(Member).filter(Member.role != 'superadmin').all()

    second_level_members = []

    for member in first_level_members:
        # For each first-level member, fetch their direct children (second-level)
        second_level_members.extend(db.query(Member).filter(Member.createdby == member.id, Member.role != 'superadmin').all())


    third_level_members = []

    for member in second_level_members:
        # For each second-level member, fetch their direct children (third-level)
        third_level_members.extend(db.query(Member).filter(Member.createdby == member.id, Member.role != 'superadmin').all())

    # Return the third-level members as MemberResponse
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
            role=m.role,
            activationhistory=m.activationhistory,
            paid=m.paid,
            paidamount=m.paidamount,
            paymentdate=m.paymentdate,
            paymentproof=m.paymentproof,
            phone=m.phone
        )
        for m in third_level_members
    ]

@app.get("/fourth-level-members/", response_model=List[MemberResponse])
def get_fourth_level_members(db: Session = Depends(get_db)):
    

    first_level_members = db.query(Member).filter(
        Member.createdby > 1,
        Member.username != 'superadmin'
    ).all()
    # first_level_members = db.query(Member).filter(Member.role != 'superadmin').all()

    second_level_members = []

    for member in first_level_members:
        # For each first-level member, fetch their direct children (second-level)
        second_level_members.extend(db.query(Member).filter(Member.createdby == member.id, Member.role != 'superadmin').all())


    third_level_members = []

    for member in second_level_members:
        # For each second-level member, fetch their direct children (third-level)
        third_level_members.extend(db.query(Member).filter(Member.createdby == member.id, Member.role != 'superadmin').all())


    fourth_level_members = []

    for member in third_level_members:
        # For each third-level member, fetch their direct children (fourth-level)
        fourth_level_members.extend(db.query(Member).filter(Member.createdby == member.id, Member.role != 'superadmin').all())

    # Return the fourth-level members as MemberResponse
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
            role=m.role,
            activationhistory=m.activationhistory,
            paid=m.paid,
            paidamount=m.paidamount,
            paymentdate=m.paymentdate,
            paymentproof=m.paymentproof,
            phone=m.phone
        )
        for m in fourth_level_members
    ]

@app.get("/fifth-level-members/", response_model=List[MemberResponse])
def get_fifth_level_members(db: Session = Depends(get_db)):
    
    first_level_members = db.query(Member).filter(
    Member.createdby > 1,
    Member.username != 'superadmin'
    ).all()
    # first_level_members = db.query(Member).filter(Member.role != 'superadmin').all()

    second_level_members = []

    for member in first_level_members:
        # For each first-level member, fetch their direct children (second-level)
        second_level_members.extend(db.query(Member).filter(Member.createdby == member.id, Member.role != 'superadmin').all())


    third_level_members = []

    for member in second_level_members:
        # For each second-level member, fetch their direct children (third-level)
        third_level_members.extend(db.query(Member).filter(Member.createdby == member.id, Member.role != 'superadmin').all())


    fourth_level_members = []

    for member in third_level_members:
        # For each third-level member, fetch their direct children (fourth-level)
        fourth_level_members.extend(db.query(Member).filter(Member.createdby == member.id, Member.role != 'superadmin').all())


    fifth_level_members = []

    for member in fourth_level_members:
        # For each fourth-level member, fetch their direct children (fifth-level)
        fifth_level_members.extend(db.query(Member).filter(Member.createdby == member.id, Member.role != 'superadmin').all())

    # Return the fifth-level members as MemberResponse
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
            role=m.role,
            activationhistory=m.activationhistory,
            paid=m.paid,
            paidamount=m.paidamount,
            paymentdate=m.paymentdate,
            paymentproof=m.paymentproof,
            phone=m.phone
        )
        for m in fifth_level_members
    ]



@app.post("/addwithdrawal/")
def addwithdrawal(wd: WithdrawalRequest, db: Session = Depends(get_db)):
    try:
        currentdate = datetime.today()
        new_withdrawal = Withdrawals(
            userid=wd.userid,
            date=currentdate,
            amount=wd.amount,
            is_approved=False,
            approvaldate=None
        )

        db.add(new_withdrawal)
        db.commit()
        db.refresh(new_withdrawal)
        return {"message": "Withdrawal added"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Adding Withdrawal failed: {str(e)}")

@app.post("/approvewithdrawal/{withdrawal_id}")
def approve_withdrawal(withdrawal_id: int, db: Session = Depends(get_db)):
    withdrawal = db.query(Withdrawals).filter(Withdrawals.id == withdrawal_id).first()

    if not withdrawal:
        raise HTTPException(status_code=404, detail="Withdrawal not found")
    
    if withdrawal.is_approved:
        return {"message": "Withdrawal already approved"}

    withdrawal.is_approved = True
    withdrawal.approvaldate = datetime.today()

    db.commit()
    db.refresh(withdrawal)

    return {"message": "Withdrawal approved", "id": withdrawal.id}

@app.get("/getallwithdrawals", response_model=List[WithdrawalResponse])
def get_all_withdrawals(db: Session = Depends(get_db)):
    # AllWithdrawals = db.query(Withdrawals).all()
    # return [
    #     WithdrawalResponse(
    #         id=wd.id,
    #         userid=wd.userid,
    #         date=wd.date,
    #         amount=wd.amount,
    #         is_approved=wd.is_approved,
    #         approvaldate=wd.approvaldate
    #     )
    #     for wd in AllWithdrawals
    # ]
    results = (
        db.query(
            Withdrawals.id,
            Withdrawals.userid,
            Withdrawals.date,
            Withdrawals.amount,
            Withdrawals.is_approved,
            Withdrawals.approvaldate,
            Member.username,
            Member.membername.label("name")
        )
        .join(Member, Withdrawals.userid == Member.id)
        # .filter(Withdrawals.userid == userid)
        .all()
    )

    return [
        WithdrawalResponse(
            id=r.id,
            userid=r.userid,
            date=r.date,
            amount=float(r.amount),  # since Numeric may need casting
            is_approved=r.is_approved,
            approvaldate=r.approvaldate,
            username=r.username,
            name=r.name
        )
        for r in results
    ]

# @app.get("/getwithdrawals/{userid}", response_model=List[WithdrawalResponse])
# def get_withdrawals(userid: int, db: Session = Depends(get_db)):
#     user_withdrawals = db.query(Withdrawals).filter(Withdrawals.userid == userid).all()
#     return [
#         WithdrawalResponse(
#             id=wd.id,
#             userid=wd.userid,
#             date=wd.date,
#             amount=wd.amount,
#             is_approved=wd.is_approved,
#             approvaldate=wd.approvaldate
#         )
#         for wd in user_withdrawals
#     ]

@app.get("/getwithdrawals/{userid}", response_model=List[WithdrawalResponse])
def get_withdrawals(userid: int, db: Session = Depends(get_db)):
    results = (
        db.query(
            Withdrawals.id,
            Withdrawals.userid,
            Withdrawals.date,
            Withdrawals.amount,
            Withdrawals.is_approved,
            Withdrawals.approvaldate,
            Member.username,
            Member.membername.label("name")
        )
        .join(Member, Withdrawals.userid == Member.id)
        .filter(Withdrawals.userid == userid)
        .all()
    )

    return [
        WithdrawalResponse(
            id=r.id,
            userid=r.userid,
            date=r.date,
            amount=float(r.amount),  # since Numeric may need casting
            is_approved=r.is_approved,
            approvaldate=r.approvaldate,
            username=r.username,
            name=r.name
        )
        for r in results
    ]


@app.patch("/approve-reject-withdrawal/{id}")
def approverejectwithdrawal(
    id: int,
    request: WithdrawalApproveRequest,
    db: Session = Depends(get_db)
):
    existing_withdrawal = db.query(Withdrawals).filter(Withdrawals.id == id).first()
    
    if not existing_withdrawal:
        raise HTTPException(status_code=400, detail="Withdrawal not found.")

    try:
        existing_withdrawal.is_approved = request.is_approved
        if request.is_approved:
            existing_withdrawal.approvaldate = date.today()
        else:
            existing_withdrawal.approvaldate = None
        db.commit()
        db.refresh(existing_withdrawal)

        return {"message": "Withdrawal updated"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")

@app.patch("/upload-payment-proof/{username}")
async def upload_payment_proof(username: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    member = db.query(Member).filter(Member.username == username, Member.role != 'superadmin').first()

    if not member:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        # Save temporarily
        guid = str(uuid4())
        temp_path = f"temp_{guid}_{file.filename}"
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        folder_id = "1wOb2ls3vkwfggp5xpWqiz7dol5W-HBYk"  
        gdrive_link = upload_file_to_drive(temp_path, file.filename, folder_id)

        # Update database
        member.paid = True
        member.paidamount = 500
        member.paymentdate = datetime.now()
        member.paymentproof = gdrive_link

        db.commit()
        db.refresh(member)

        # Clean up
        os.remove(temp_path)

        return {
            "message": "Payment info updated",
            "username": member.username,
            "paid": member.paid,
            "paidamount": str(member.paidamount),
            "paymentdate": member.paymentdate.isoformat(),
            "paymentproof": gdrive_link
        }

    except Exception as e:
        db.rollback()
        traceback.print_exc()  # <- This prints the full stack trace to Render logs
        raise HTTPException(status_code=500, detail=f"Error uploading to Drive: {str(e)}")


@app.post("/logout/")
def logout():
    return {"message": "Logout successful. Clear the token on the client side."}

# if __name__ == "__main__":
#     import uvicorn
#     port = int(os.environ.get("PORT", 8000))  # Render sets $PORT
#     uvicorn.run(app, host="0.0.0.0", port=port)
