from fastapi import HTTPException
from schemas.user import UserRegisterRequest, UserLoginRequest, UserRegisterResponse, UserLoginResponse
from auth.security import hash_password, verify_password, create_access_token
from models.user import User
from datetime import timedelta

async def register_user(user_data: UserRegisterRequest):
    existing = await User.find_one(User.email == user_data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(user_data.password)
    user = User(email=user_data.email, username=user_data.username, hashed_password=hashed)
    await user.insert()
    return UserRegisterResponse(
        message="User registered successfully!"
    )

async def authenticate_user(user_data: UserLoginRequest):
    user = await User.find_one(User.email == user_data.email)
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password!")

    token = create_access_token(data={"sub": str(user.id)}, expires_delta=timedelta(minutes=30))
    return UserLoginResponse(access_token=token, token_type="Bearer")
