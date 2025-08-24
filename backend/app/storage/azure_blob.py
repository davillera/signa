import uuid
from azure.storage.blob import BlobServiceClient, ContentSettings
from fastapi import UploadFile, HTTPException
from app.config import get_settings

settings = get_settings()

# Crear cliente del servicio blob y del contenedor
blob_service_client = BlobServiceClient.from_connection_string(
    settings.AZURE_STORAGE_CONNECTION_STRING
)
container_client = blob_service_client.get_container_client(
    settings.AZURE_STORAGE_CONTAINER
)


def upload_logo(file: UploadFile, brand_id: str):
    if file.content_type not in ["image/jpeg", "image/png", "image/gif", "image/webp"]:
        raise HTTPException(status_code=400, detail="Tipo de archivo no soportado.")

    extension = file.filename.split(".")[-1]
    blob_name = f"{brand_id}_{uuid.uuid4().hex}.{extension}"

    # Crear blob client
    blob_client = container_client.get_blob_client(blob_name)
    
    content_settings = ContentSettings(content_type=file.content_type)

    blob_client.upload_blob(file.file, overwrite=True, content_settings=content_settings)

    # Construir URL accesible públicamente
    logo_url = (
        f"https://{blob_service_client.account_name}.blob.core.windows.net/"
        f"{settings.AZURE_STORAGE_CONTAINER}/{blob_name}"
    )

    return logo_url, blob_name


def delete_logo(blob_name: str):
    blob_client = container_client.get_blob_client(blob_name)
    blob_client.delete_blob()
