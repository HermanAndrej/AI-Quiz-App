from pydantic import BaseModel
from pydantic import EmailStr
from datetime import datetime

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

#class Token(BaseModel):
 #   access_token: str 
  #  token_type: str