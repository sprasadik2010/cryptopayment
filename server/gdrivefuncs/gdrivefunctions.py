import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# Define the scope
SCOPES = ['https://www.googleapis.com/auth/drive.file']

def get_drive_service():
    # Load service account info from environment variable
    service_account_info = json.loads(os.environ["GOOGLE_SERVICE_ACCOUNT"])
    creds = service_account.Credentials.from_service_account_info(
        service_account_info, scopes=SCOPES
    )
    return build('drive', 'v3', credentials=creds)

def upload_file_to_drive(local_file_path: str, filename: str, folder_id: str):
    service = get_drive_service()
    file_metadata = {
        "name": filename,
        "parents": [folder_id]
    }
    media = MediaFileUpload(local_file_path, resumable=True)
    uploaded_file = service.files().create(
        body=file_metadata,
        media_body=media,
        fields="id"  # Only need the file ID
    ).execute()

    file_id = uploaded_file["id"]
    direct_link = f"https://drive.google.com/uc?export=view&id={file_id}"
    return direct_link
