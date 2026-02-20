import os
from pathlib import Path
import configparser
from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


_CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
_BASE_DIR = os.path.normpath(os.path.join(_CURRENT_DIR, "..", ".."))
VERSION_FILE = os.path.join(_BASE_DIR, "VERSION")
DEFAULT_INI_FILE = os.path.join(_BASE_DIR, "data", "config.ini")


def _get_version():
    """
    """
    try:
        with open(VERSION_FILE, "r", encoding="utf-8") as f:
            return f.read().strip()
    except FileNotFoundError:
        return "unknown"


class Settings(BaseSettings):
    """
    """

    PROJECT_NAME: str = "Project Key"
    VERSION: str = _get_version()
    
    LOG_LEVEL: str = Field(default="info")
    FILE_PATH: Optional[str] = Field(default=None)

    model_config = SettingsConfigDict(
        extra="ignore"
    )


    def load_from_ini(self, ini_path: Path):
        """
        """
        if not os.path.exists(ini_path):
            return

        config = configparser.ConfigParser()
        config.read(ini_path, encoding="utf-8")
        target_fields = self.model_fields.keys()

        for section in config.sections() + ['DEFAULT']:
            for field_name in target_fields:
                val = config[section].get(field_name.lower(), None)
                if val is not None:
                    setattr(self, field_name, val)


    def setup_with_args(self, args):
        """
        """
        args_dict = vars(args)
        for field_name in self.model_fields.keys():
            if field_name.lower() in args_dict and args_dict[field_name.lower()] is not None:
                setattr(self, field_name, args_dict[field_name.lower()])


settings = Settings()