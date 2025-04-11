from pydantic import BaseModel
from pydantic import EmailStr

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
    email: EmailStr
    username: str

#class Token(BaseModel):
 #   access_token: str 
  #  token_type: str