from models.quiz import Quiz
from models.quiz_result import QuizResult
from fastapi import HTTPException

async def get_quiz_by_id(quiz_id: int) -> Quiz:
    quiz = await Quiz.find_one(Quiz.quiz_id == quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz

async def submit_quiz_logic(quiz, submitted_answers: dict):
    correct_answers = {q.question_id: q.correct_option for q in quiz.questions}
    correct_count = sum(1 for qid, ans in submitted_answers.items() if correct_answers.get(qid) == ans)
    total_questions = len(quiz.questions)
    score = int((correct_count / total_questions) * 100)  # Convert to percentage
    return score

async def get_quiz_result_logic(quiz_id: int, user_id: str) -> QuizResult:
    quiz_result = await QuizResult.find_one(
        QuizResult.quiz_id == quiz_id,
        QuizResult.user_id == user_id
    )
    if not quiz_result:
        raise HTTPException(status_code=404, detail="Quiz result not found")
    return quiz_result

async def get_recent_quiz_results_by_user_id(user_id: str, n: int):
    return await QuizResult.find(
        QuizResult.user_id == user_id
    ).sort(
        -QuizResult.created_at  # descending = most recent first
    ).limit(n).to_list()

async def get_recent_quizzes_by_user(user_id: str, n: int):
    return await Quiz.find(
        Quiz.created_by == user_id
    ).sort(
        -Quiz.created_at  # descending = most recent first
    ).limit(n).to_list()