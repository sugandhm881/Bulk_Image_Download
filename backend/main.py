from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.download_routes import router as download_router

app = FastAPI(
    title="Bulk Image Downloader API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(download_router)

@app.get("/")
def home():
    return {
        "message": "Backend Running Successfully"
    }