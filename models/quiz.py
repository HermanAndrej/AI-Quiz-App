from beanie import Document, Indexed
from typing import List, Dict
from datetime import datetime, timezone
from pydantic import Field, BaseModel
from enum import Enum

class Difficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"
    VERY_HARD = "very_hard"

class Question(BaseModel):
    question_id: int
    question_text: str
    options: Dict[str, str]
    correct_option: str

class Quiz(Document):
    quiz_id: int = Indexed(int, unique=True)
    topic: str
    difficulty: Difficulty
    number_of_questions: int
    questions: List[Question]
    created_by: int  # user_id of the creator
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "quizzes"