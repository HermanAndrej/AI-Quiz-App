from fastapi import APIRouter, HTTPException, status
from schemas.quiz import (
    QuizGenerateRequest,
    QuizGenerateResponse,
    QuizSubmitRequest,
    QuizSubmitResponse
)
from services.openai_service import generate_quiz_ai
from models.quiz import Quiz
from auth.deps import get_current_user, get_current_user_id

router = APIRouter(prefix="/quiz", tags=["quiz"])

@router.post("/generate", response_model=QuizGenerateResponse, status_code=status.HTTP_201_CREATED)
async def generate_quiz(quiz_request: QuizGenerateRequest) -> QuizGenerateResponse:
    return await generate_quiz_ai(
        topic=quiz_request.topic,
        difficulty=quiz_request.difficulty,
        number_of_questions=quiz_request.number_of_questions,
    )

from beanie import PydanticObjectId

@router.post("/submit", response_model=QuizSubmitResponse, status_code=status.HTTP_200_OK)
async def submit_quiz(quiz_submit_request: QuizSubmitRequest) -> QuizSubmitResponse:
    quiz_id = PydanticObjectId(quiz_submit_request.quiz_id) if isinstance(quiz_submit_request.quiz_id, str) else quiz_submit_request.quiz_id
    
    quiz = await Quiz.get(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    correct_answers = {q.question_id: q.correct_option for q in quiz.questions}
    submitted_answers = quiz_submit_request.answers
    
    score = sum(1 for qid, ans in submitted_answers.items() if correct_answers.get(qid) == ans)
    
    return QuizSubmitResponse(
        score=score,
        total=quiz.number_of_questions,
        message="Quiz submitted successfully"
    )