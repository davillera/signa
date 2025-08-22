from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_db
from app.routers import auth as auth_router
from app.routers import brands as brands_router

settings = get_settings()

def create_app() -> FastAPI:
    app = FastAPI(title=settings.APP_NAME)

    # CORS
    if settings.CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.CORS_ORIGINS,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # Routers
    app.include_router(auth_router.router)
    app.include_router(brands_router.router)

    @app.get("/healthz")
    def health():
        return {"status": "ok"}

    @app.on_event("startup")
    def on_startup():
        init_db()

    return app

app = create_app()
