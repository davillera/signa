import uuid
from azure.storage.blob import BlobServiceClient
from fastapi import UploadFile
from app.config import get_settings

settings = get_settings()

blob_service_client = BlobServiceClient.from_connection_string(settings.AZURE_STORAGE_CONNECTION_STRING)
container_client = blob_service_client.get_container_client(settings.AZURE_STORAGE_CONTAINER)


def upload_logo(file: UploadFile, brand_id):
    # Nombre único en raíz del contenedor
    extension = file.filename.split(".")[-1]
    blob_name = f"{brand_id}_{uuid.uuid4().hex}.{extension}"

    blob_client = container_client.get_blob_client(blob_name)
    blob_client.upload_blob(file.file, overwrite=True)

    logo_url = f"https://{blob_service_client.account_name}.blob.core.windows.net/{settings.AZURE_STORAGE_CONTAINER}/{blob_name}"
    return logo_url, blob_name


def delete_logo(blob_name: str):
    blob_client = container_client.get_blob_client(blob_name)
    blob_client.delete_blob()
