from pydantic import BaseModel, Field
from typing import List, Dict
from datetime import datetime

class QuizGenerateRequest(BaseModel):
#    user_id: int
    topic: str
    difficulty:str
    number_of_questions: int = Field(..., gt=0, le=10)

class QuestionOptions(BaseModel):
    a: str
    b: str
    c: str
    d: str

class QuizQuestion(BaseModel):
    question_id: int
    question_text: str
    options: QuestionOptions
    correct_option: str

class QuizGenerateResponse(BaseModel):
    questions: List[QuizQuestion]
    created_at: datetime

class QuizSubmitRequest(BaseModel):
    answers: Dict[int, str]
    quiz_id: str

class QuizSubmitResponse(BaseModel):
    score: int
    total: int
    message: str