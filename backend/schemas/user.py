from pydantic import BaseModel
from pydantic import EmailStr
from datetime import datetime
from typing import Optional

class UserRegisterRequest(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserRegisterResponse(BaseModel):
    message: str

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserLoginResponse(BaseModel):
    access_token: str
    token_type: str

class UserReadResponse(BaseModel):
    user_id: int
    email: EmailStr
    username: str
    joined_at: datetime

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class ChangePasswordResponse(BaseModel):
    message: str

class UpdateProfileRequest(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None

class UpdateProfileResponse(BaseModel):
    message: str
    user: UserReadResponse
