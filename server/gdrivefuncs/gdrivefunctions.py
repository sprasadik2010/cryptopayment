import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from PIL import Image

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
        fields="id"
    ).execute()

    file_id = uploaded_file["id"]

    # Make the file publicly accessible
    permission = {
        "type": "anyone",
        "role": "reader"
    }
    service.permissions().create(
        fileId=file_id,
        body=permission
    ).execute()

    # Return Google Drive file id
    return file_id

def minimize_image(file_bytes, max_width=800, max_height=800, quality=75):
    # Load image from bytes
    image = Image.open(io.BytesIO(file_bytes))
    
    # Resize while maintaining aspect ratio
    image.thumbnail((max_width, max_height))
    
    # Save to bytes buffer with compression/quality
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG", quality=quality)
    
    buffer.seek(0)
    return buffer.read()
