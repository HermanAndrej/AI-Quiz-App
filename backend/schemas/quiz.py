from pydantic import BaseModel, Field
from typing import List, Dict
from datetime import datetime
from models.quiz import Question

class QuizGenerateRequest(BaseModel):
#    user_id: int
    topic: str
    difficulty: str
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
    quiz_id: int
    created_by: int  # user_id of the creator

class QuizSubmitRequest(BaseModel):
    answers: Dict[int, str]
    quiz_id: int

class QuizSubmitResponse(BaseModel):
    score: int
    total: int
    message: str

class QuizResultResponse(BaseModel):
    quiz_id: int
    user_id: int
    score: int
    total_questions: int
    submitted_answers: Dict[int, str]
    created_at: datetime

class GetQuizResponse(BaseModel):
    quiz_id: int
    topic: str
    difficulty: str
    number_of_questions: int
    questions: List[Question]
    created_at: datetime
    created_by: int