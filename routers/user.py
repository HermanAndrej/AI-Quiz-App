from fastapi import APIRouter, HTTPException, status, Depends
from services.user_service import get_basic_user_stats
from schemas.user import UserReadResponse
from auth.deps import get_current_user
from models.user import User

router = APIRouter(prefix="/user", tags=["user"])

@router.get("/me", response_model=UserReadResponse, status_code=status.HTTP_200_OK)
async def read_user(current_user: User = Depends(get_current_user)):
    return UserReadResponse(
        user_id=current_user.user_id,
        email=current_user.email,
        username=current_user.username,
        joined_at=current_user.joined_at
    )

@router.get("/{user_id}/statistics")
async def user_basic_stats(user_id: int):
    stats = await get_basic_user_stats(user_id)
    if not stats:
        raise HTTPException(status_code=404, detail="No quiz results found for this user")

    return {
        "total_quizzes": stats["total_quizzes"],
        "average_score": stats["average_score"],
        "highest_score": stats["highest_score"],
        "lowest_score": stats["lowest_score"]
    }
