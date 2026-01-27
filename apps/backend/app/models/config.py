from beanie import Document
from pydantic import Field

class AppConfig(Document):
    registration_open: bool = Field(default=True)
    registration_cap: int = Field(default=174)

    class Settings:
        name = "app_config"
