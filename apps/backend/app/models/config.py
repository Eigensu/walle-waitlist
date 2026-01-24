from beanie import Document
from pydantic import Field

class AppConfig(Document):
    registration_open: bool = Field(default=True)

    class Settings:
        name = "app_config"
