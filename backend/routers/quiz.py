from fastapi import APIRouter, HTTPException, status, Depends
from schemas.quiz import (
    QuizGenerateRequest,
    QuizGenerateResponse,
    QuizSubmitRequest,
    QuizSubmitResponse,
    GetQuizResponse
)
from services.openai_service import generate_quiz_ai
from models.quiz import Quiz, Question
from models.user import User
from models.quiz_result import QuizResult
from auth.deps import get_current_user_id, get_current_user
from services.quiz_service import get_quiz_by_id, submit_quiz_logic, get_quiz_result_logic, get_recent_quiz_results_by_user_id, get_recent_quizzes_by_user

router = APIRouter(prefix="/quiz", tags=["quiz"])

# Generates a quiz based on the provided topic, difficulty, and number of questions
@router.post("/generate", response_model=QuizGenerateResponse, status_code=status.HTTP_201_CREATED)
async def generate_quiz(quiz_request: QuizGenerateRequest, created_by: str = Depends(get_current_user_id)) -> QuizGenerateResponse:
    return await generate_quiz_ai(
        topic=quiz_request.topic,
        difficulty=quiz_request.difficulty,
        number_of_questions=quiz_request.number_of_questions,
        created_by=created_by
    )

# Submits a quiz with the user's answers and calculates the score, saves the result in QuizResult
@router.post("/submit", response_model=QuizSubmitResponse, status_code=status.HTTP_200_OK)
async def submit_quiz(quiz_submit_request: QuizSubmitRequest, current_user: User = Depends(get_current_user)) -> QuizSubmitResponse:
    quiz = await get_quiz_by_id(quiz_submit_request.quiz_id)
    score = await submit_quiz_logic(quiz, quiz_submit_request.answers)

    quiz_result = QuizResult(
        quiz_id=quiz.quiz_id,
        user_id=current_user.user_id,
        score=score,
        total_questions=quiz.number_of_questions,
        submitted_answers=quiz_submit_request.answers
    )
    quiz_result = await quiz_result.insert()
    if not quiz_result:
        raise HTTPException(status_code=500, detail="Failed to save quiz result")

    # Build correct_answers dict from quiz.questions
    correct_answers = {q.question_id: q.correct_option for q in quiz.questions}

    return QuizSubmitResponse(
        score=score,
        total=quiz.number_of_questions,
        message="Quiz submitted successfully",
        correct_answers=correct_answers
    )

# Retrieves a quiz by its ID, including all questions and their options
@router.get("/{quiz_id}", response_model=Quiz)
async def get_quiz(quiz_id: int, current_user: User = Depends(get_current_user)) -> GetQuizResponse:
    return await get_quiz_by_id(quiz_id)

@router.get("/recent/{n}", response_model=list[Quiz])
async def get_recent_quizzes(n: int, current_user: User = Depends(get_current_user)) -> list[Quiz]:
    return await get_recent_quizzes_by_user(current_user.user_id, n)

# Retrieves the quiz result for a specific quiz and user
@router.get("/result/{quiz_id}", response_model=QuizResult)
async def get_quiz_result(quiz_id: int, user: User = Depends(get_current_user)) -> QuizResult:
    return await get_quiz_result_logic(quiz_id, user.user_id)

@router.get("/result/recent/{n}", response_model=list[QuizResult])
async def get_recent_quiz_results(n: int, current_user: User = Depends(get_current_user)) -> list[QuizResult]:
    return await get_recent_quiz_results_by_user_id(current_user.user_id, n)