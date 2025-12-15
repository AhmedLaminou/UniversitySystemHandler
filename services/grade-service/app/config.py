from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    jwt_secret: str
    auth_service_url: str
    port: int = 8000 

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()