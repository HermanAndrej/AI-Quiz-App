from beanie import Document
from pydantic import EmailStr

class User(Document):
    #user_id: int
    email: EmailStr
    username: str
    hashed_password: str

    class Settings:
        collection = "users"
        #indexes = ["user_id"]
