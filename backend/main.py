from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.download_routes import router as download_router

app = FastAPI(
    title="Bulk Image Download API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes live under /api so the same paths work on Vercel
# (vercel.json routes /api/* to the Python function).
app.include_router(download_router, prefix="/api")


@app.get("/api")
@app.get("/")
def home():
    return {
        "message": "Backend Running Successfully"
    }
