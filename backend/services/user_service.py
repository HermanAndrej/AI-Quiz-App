from models.quiz_result import QuizResult

async def get_basic_user_stats(user_id: int):
    pipeline = [
        {"$match": {"user_id": user_id}},
        {
            "$group": {
                "_id": None,
                "total_quizzes": {"$sum": 1},
                "average_score": {"$avg": "$score"},
                "highest_score": {"$max": "$score"},
                "lowest_score": {"$min": "$score"},
            }
        }
    ]
    
    result = await QuizResult.aggregate(pipeline).to_list(length=1)
    return result[0] if result else None