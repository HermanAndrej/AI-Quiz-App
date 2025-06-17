from beanie import Document, Indexed
from typing import List, Dict
from datetime import datetime, timezone
from pydantic import Field

class QuizResult(Document):
    quiz_id: int = Indexed(int, unique=True)
    user_id: int = Indexed(int) # user_id of the person who took the quiz
    score: int
    total_questions: int
    submitted_answers: Dict[int, str]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "quiz_result"