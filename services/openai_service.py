from openai import AsyncOpenAI
from config import settings
from models.quiz import Quiz, Question
from schemas.quiz import QuizGenerateResponse, QuizQuestion
import json

async def generate_quiz_ai(topic: str, difficulty: str, number_of_questions: int) -> QuizGenerateResponse:
    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    prompt = f"""
    Generate a quiz on the topic "{topic}" with difficulty level "{difficulty}" containing {number_of_questions} multiple-choice questions.
    
    Return your response as JSON with the following structure:
    {{
      "questions": [
        {{
          "question_id": 1,
          "question_text": "Question text goes here?",
          "options": {{
            "a": "First option",
            "b": "Second option",
            "c": "Third option",
            "d": "Fourth option"
          }},
          "correct_option": "a"
        }}
      ]
    }}
    
    Each question should have a unique question_id starting from 1.
    Each question should have 4 options labeled "a", "b", "c", and "d".
    The correct_option must be one of: "a", "b", "c", or "d".
    
    For {difficulty} difficulty:
    - Easy: Basic concepts.
    - Medium: Some deeper understanding.
    - Hard: Comprehensive and challenging.
    
    Ensure factual accuracy and clarity.
    """

    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )

    content = response.choices[0].message.content
    json_data = json.loads(content)

    question_objs = []
    for q in json_data.get("questions", []):
        question_objs.append(Question(**q))

    quiz = Quiz(
        topic=topic,
        difficulty=difficulty,
        number_of_questions=number_of_questions,
        questions=question_objs
    )

    await quiz.insert()

    return QuizGenerateResponse(
        questions=json_data["questions"]
    )