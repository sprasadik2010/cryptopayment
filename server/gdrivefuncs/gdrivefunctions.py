import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# Define the scope
SCOPES = ['https://www.googleapis.com/auth/drive.file']
SERVICE_ACCOUNT_FILE = 'service_account.json'  # keep this in your backend folder

def get_drive_service():
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=SCOPES
    )
    return build('drive', 'v3', credentials=creds)

def upload_file_to_drive(local_file_path: str, filename: str, folder_id: str):
    service = get_drive_service()
    file_metadata = {
        "name": filename,
        "parents": [folder_id]  # Uploads into CryptoPaymentUploads folder
    }
    media = MediaFileUpload(local_file_path, resumable=True)
    uploaded_file = service.files().create(
        body=file_metadata,
        media_body=media,
        fields="id, webViewLink"
    ).execute()
    return uploaded_file["webViewLink"]
