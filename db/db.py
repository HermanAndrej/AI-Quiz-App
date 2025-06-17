from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from config import settings
from models.user import User
from models.quiz import Quiz
from models.quiz_result import QuizResult

async def init_db():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DATABASE_NAME]
    await init_beanie(database=db, document_models=[User, Quiz, QuizResult])