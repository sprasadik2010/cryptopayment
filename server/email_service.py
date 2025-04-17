import smtplib
from email.message import EmailMessage

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_EMAIL = "sprasadik@gmail.com"
SMTP_PASSWORD = "ytxznztxtkrcgvmm"  # Use App Password, NOT your Gmail password!

def send_verification_email(email: str, token: str):
    msg = EmailMessage()
    msg["Subject"] = "Verify Your Email"
    msg["From"] = SMTP_EMAIL
    msg["To"] = email

    verification_link = f"http://localhost:5173/verify/{token}"
    msg.set_content(f"Click the link to verify your email: {verification_link}")

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.send_message(msg)

# Example usage
# send_verification_email("recipient@example.com", "sample-token-123")
