import pytest
from services.quiz_service import submit_quiz_logic
from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime, timezone
from enum import Enum

# MOCK MODELS
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

class Quiz(BaseModel):
    quiz_id: int
    topic: str
    difficulty: Difficulty
    number_of_questions: int
    questions: List[Question]
    created_by: int
    created_at: datetime

@pytest.mark.asyncio
async def test_submit_quiz_perfect_score():
    questions = [
        Question(
            question_id=1,
            question_text="Test question 1",
            options={"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"},
            correct_option="A"
        ),
        Question(
            question_id=2,
            question_text="Test question 2",
            options={"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"},
            correct_option="B"
        )
    ]
    
    quiz = Quiz(
        quiz_id=1,
        topic="Test",
        difficulty=Difficulty.EASY,
        number_of_questions=2,
        questions=questions,
        created_by=1,
        created_at=datetime.now(timezone.utc)
    )
    
    submitted_answers = {1: "A", 2: "B"}
    score = await submit_quiz_logic(quiz, submitted_answers)
    assert score == 100

@pytest.mark.asyncio
async def test_submit_quiz_partial_score():
    questions = [
        Question(
            question_id=1,
            question_text="Test question 1",
            options={"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"},
            correct_option="A"
        ),
        Question(
            question_id=2,
            question_text="Test question 2",
            options={"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"},
            correct_option="B"
        )
    ]
    
    quiz = Quiz(
        quiz_id=1,
        topic="Test",
        difficulty=Difficulty.EASY,
        number_of_questions=2,
        questions=questions,
        created_by=1,
        created_at=datetime.now(timezone.utc)
    )
    
    submitted_answers = {1: "A", 2: "C"}
    score = await submit_quiz_logic(quiz, submitted_answers)
    assert score == 50

@pytest.mark.asyncio
async def test_submit_quiz_zero_score():
    questions = [
        Question(
            question_id=1,
            question_text="Test question 1",
            options={"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"},
            correct_option="A"
        ),
        Question(
            question_id=2,
            question_text="Test question 2",
            options={"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"},
            correct_option="B"
        )
    ]
    
    quiz = Quiz(
        quiz_id=1,
        topic="Test",
        difficulty=Difficulty.EASY,
        number_of_questions=2,
        questions=questions,
        created_by=1,
        created_at=datetime.now(timezone.utc)
    )
    
    submitted_answers = {1: "C", 2: "D"}
    score = await submit_quiz_logic(quiz, submitted_answers)
    assert score == 0

@pytest.mark.asyncio
async def test_submit_quiz_missing_answers():
    questions = [
        Question(
            question_id=1,
            question_text="Test question 1",
            options={"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"},
            correct_option="A"
        ),
        Question(
            question_id=2,
            question_text="Test question 2",
            options={"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"},
            correct_option="B"
        )
    ]
    
    quiz = Quiz(
        quiz_id=1,
        topic="Test",
        difficulty=Difficulty.EASY,
        number_of_questions=2,
        questions=questions,
        created_by=1,
        created_at=datetime.now(timezone.utc)
    )
    
    submitted_answers = {1: "A"}
    score = await submit_quiz_logic(quiz, submitted_answers)
    assert score == 50

@pytest.mark.asyncio
async def test_submit_quiz_invalid_question_id():
    questions = [
        Question(
            question_id=1,
            question_text="Test question 1",
            options={"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"},
            correct_option="A"
        ),
        Question(
            question_id=2,
            question_text="Test question 2",
            options={"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"},
            correct_option="B"
        )
    ]
    
    quiz = Quiz(
        quiz_id=1,
        topic="Test",
        difficulty=Difficulty.EASY,
        number_of_questions=2,
        questions=questions,
        created_by=1,
        created_at=datetime.now(timezone.utc)
    )
    
    submitted_answers = {1: "A", 999: "B"}
    score = await submit_quiz_logic(quiz, submitted_answers)
    assert score == 50 