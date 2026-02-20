from pathlib import Path
import configparser
from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


# Base path definitions usando pathlib
_CURRENT_DIR = Path(__file__).resolve().parent
_BASE_DIR = _CURRENT_DIR.parent.parent
VERSION_FILE = _BASE_DIR / "VERSION"
DEFAULT_INI_FILE = _BASE_DIR / "data" / "config.default.ini"


def _get_version() -> str:
    """
    Retrieve the project version from the VERSION file.

    :return: The version string if the file exists, otherwise 'unknown'.
    :rtype: str
    """
    try:
        # pathlib permite leer texto directamente sin necesidad de usar el bloque 'with open()'
        return VERSION_FILE.read_text(encoding="utf-8").strip()
    except FileNotFoundError:
        return "unknown"


class Settings(BaseSettings):
    """
    Global application settings.
    """


    PROJECT_NAME: str = "Project Key"
    VERSION: str = _get_version()
    
    LOG_LEVEL: str = Field(default="info")
    FILE_PATH: Optional[str] = Field(default=None)

    LOG_DIR: str = Field(default="logs")
    LOG_FILENAME: str = Field(default="app.log")

    model_config = SettingsConfigDict(
        extra="ignore"
    )


    def load_from_ini(self, ini_path: Path) -> None:
        """
        Load configuration values from a specified INI file.

        :param ini_path: The filesystem path to the .ini configuration file.
        :type ini_path: Path
        """
        if not ini_path.exists():
            raise FileNotFoundError(f"Mandatory configuration file not found at: {ini_path}")

        config = configparser.ConfigParser()
        config.read(ini_path, encoding="utf-8")
        target_fields = self.model_fields.keys()

        for section in config.sections() + ['DEFAULT']:
            for field_name in target_fields:
                val = config[section].get(field_name.lower(), None)
                if val is not None:
                    setattr(self, field_name, val)


    def setup_with_args(self, args) -> None:
        """
        Apply command-line arguments to the settings instance.

        :param args: The parsed arguments object from argparse.
        :type args: argparse.Namespace
        """
        args_dict = vars(args)
        for field_name in self.model_fields.keys():
            if field_name.lower() in args_dict and args_dict[field_name.lower()] is not None:
                setattr(self, field_name, args_dict[field_name.lower()])


# Global settings singleton
settings = Settings()