from fastapi import FastAPI
import uvicorn
from starlette.middleware.cors import CORSMiddleware

from config import Settings
from db.db import init_db
from routers import auth, quiz, user

settings = Settings()

async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(title=settings.app_name, debug=settings.debug, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.ALLOW_ORIGIN],  # Your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(quiz.router)
app.include_router(auth.router)
app.include_router(user.router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=settings.debug)

