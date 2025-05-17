import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_EMAIL = os.getenv("SMTP_EMAIL", "your-default-email@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "your-default-app-password")

# Frontend URL to be used in the verification link
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

def send_verification_email(email: str, token: str):
    msg = EmailMessage()
    msg["Subject"] = "Verify Your Email"
    msg["From"] = SMTP_EMAIL
    msg["To"] = email

    verification_link = f"{FRONTEND_URL}/verify/{token}"
    msg.set_content(f"Click the link to verify your email: {verification_link}")

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.send_message(msg)
