from beanie import Document
from pydantic import EmailStr, Field
from datetime import datetime, timezone

class User(Document):
    user_id: int = Field(..., unique=True)
    email: EmailStr = Field(..., unique=True)
    username: str
    hashed_password: str
    joined_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"