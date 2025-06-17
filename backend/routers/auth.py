from fastapi import APIRouter, status, Depends

from schemas.user import UserRegisterRequest, UserRegisterResponse, UserLoginRequest, UserReadResponse, UserLoginResponse
from auth.auth import register_user, authenticate_user
from auth.deps import get_current_user
from models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserRegisterRequest) -> UserRegisterResponse:
    return await register_user(user)

@router.post("/login", status_code=status.HTTP_200_OK)
async def login(user: UserLoginRequest) -> UserLoginResponse:
    return await authenticate_user(user)