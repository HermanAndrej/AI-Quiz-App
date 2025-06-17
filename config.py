from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URI: str
    DATABASE_NAME: str
    app_name: str = "AI Quiz App"
    debug: bool = True
    SECRET_KEY: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    OPENAI_API_KEY: str
    ALLOW_ORIGIN: str

    class Config:
        env_file = ".env"

settings = Settings()
