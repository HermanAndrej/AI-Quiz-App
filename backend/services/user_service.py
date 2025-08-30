from models.quiz_result import QuizResult
from models.quiz import Quiz
from models.user import User
from auth.security import hash_password, verify_password
from typing import Dict, Any
from datetime import datetime, timedelta
from fastapi import HTTPException

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

async def get_comprehensive_user_statistics(user_id: str) -> Dict[str, Any]:
    """Get comprehensive quiz statistics for a user."""
    results = await QuizResult.find(QuizResult.user_id == user_id).to_list()
    
    if not results:
        return {
            "total_quizzes": 0,
            "average_score": 0,
            "best_score": 0,
            "total_questions_answered": 0,
            "difficulty_breakdown": {},
            "topic_breakdown": {}
        }
    
    scores = [r.score for r in results]
    total_questions = sum(r.total_questions for r in results)
    
    # Get quiz details for breakdown
    difficulty_stats = {}
    topic_stats = {}
    
    for result in results:
        quiz = await Quiz.find_one(Quiz.quiz_id == result.quiz_id)
        if not quiz:
            continue
            
        # Difficulty breakdown
        diff = quiz.difficulty.value
        if diff not in difficulty_stats:
            difficulty_stats[diff] = {"count": 0, "avg_score": 0, "scores": []}
        difficulty_stats[diff]["count"] += 1
        difficulty_stats[diff]["scores"].append(result.score)
        
        # Topic breakdown
        topic = quiz.topic
        if topic not in topic_stats:
            topic_stats[topic] = {"count": 0, "avg_score": 0, "scores": []}
        topic_stats[topic]["count"] += 1
        topic_stats[topic]["scores"].append(result.score)
    
    # Calculate averages
    for diff_data in difficulty_stats.values():
        diff_data["avg_score"] = sum(diff_data["scores"]) // len(diff_data["scores"])
        del diff_data["scores"]
        
    for topic_data in topic_stats.values():
        topic_data["avg_score"] = sum(topic_data["scores"]) // len(topic_data["scores"])
        del topic_data["scores"]
    
    return {
        "total_quizzes": len(results),
        "average_score": sum(scores) // len(scores),
        "best_score": max(scores),
        "total_questions_answered": total_questions,
        "difficulty_breakdown": difficulty_stats,
        "topic_breakdown": topic_stats,
        "recent_activity": len([r for r in results if r.created_at >= datetime.now().replace(tzinfo=None) - timedelta(days=7)])
    }

async def change_user_password(user_id: int, current_password: str, new_password: str) -> bool:
    """Change user password after verifying current password."""
    try:
        # Get user from database
        user = await User.find_one(User.user_id == user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Verify current password
        if not verify_password(current_password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        
        # Hash new password and update
        new_hashed_password = hash_password(new_password)
        user.hashed_password = new_hashed_password
        await user.save()
        
        return True
    except Exception as e:
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(status_code=500, detail="Failed to change password")

async def update_user_profile(user_id: int, username: str = None, email: str = None) -> User:
    """Update user profile information."""
    try:
        user = await User.find_one(User.user_id == user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check if new username/email already exists
        if username and username != user.username:
            existing_user = await User.find_one(User.username == username)
            if existing_user and existing_user.user_id != user_id:
                raise HTTPException(status_code=400, detail="Username already taken")
            user.username = username
        
        if email and email != user.email:
            existing_user = await User.find_one(User.email == email)
            if existing_user and existing_user.user_id != user_id:
                raise HTTPException(status_code=400, detail="Email already taken")
            user.email = email
        
        await user.save()
        return user
    except Exception as e:
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(status_code=500, detail="Failed to update profile")