from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # App
    app_name: str = "VerifyChain"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # Database
    database_url: str = "sqlite:///./verifychain.db"
    
    # Security
    secret_key: str = "your-secret-key-change-this-min-32-chars"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS
    cors_origins: list = ["http://localhost:3000", "http://localhost:5173"]
    
    class Config:
        env_file = ".env"

settings = Settings()