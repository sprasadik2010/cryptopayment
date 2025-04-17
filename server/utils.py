from itsdangerous import URLSafeTimedSerializer
from fastapi import HTTPException

SECRET_KEY = "crypto"
serializer = URLSafeTimedSerializer(SECRET_KEY)

def generate_verification_token(email: str, username: str) -> str:
    return serializer.dumps(f"{email}|{username}", salt="email-verification")

def verify_token(token: str) -> tuple[str, str]:
    try:
        data = serializer.loads(token, salt="email-verification", max_age=3600)  # Expires in 1 hour
        email, username = data.split("|")
        return email, username
    except:
        raise HTTPException(status_code=400, detail="Invalid or expired token")