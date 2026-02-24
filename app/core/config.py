import configparser
import argparse
from pathlib import Path
from typing import Any, Dict, Optional, Tuple, Type
from pydantic import Field
from pydantic.fields import FieldInfo
from pydantic_settings import (
    BaseSettings, 
    SettingsConfigDict, 
    PydanticBaseSettingsSource
)

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
        return VERSION_FILE.read_text(encoding="utf-8").strip()
    except FileNotFoundError:
        return "unknown"


class IniConfigSettingsSource(PydanticBaseSettingsSource):
    """
    Custom configuration source for Pydantic to read 
    default values from an .ini file.
    """


    def get_field_value(self, field: FieldInfo, field_name: str) -> Tuple[Any, str, bool]:
        """
        """
        return None, field_name, False


    def prepare_field_value(self, field_name: str, field: FieldInfo, value: Any, value_is_complex: bool) -> Any:
        """
        """
        return value


    def __call__(self) -> Dict[str, Any]:
        """
        Reads the default .ini configuration file and maps its 
        values to the fields defined in the Pydantic model.

        :return: A dictionary with the keys and values extracted from the file, 
                 ready to be injected and validated.
        :rtype: Dict[str, Any]
        """
        settings_dict: Dict[str, Any] = {}
        
        if not DEFAULT_INI_FILE.exists():
            return settings_dict

        config = configparser.ConfigParser()
        config.read(DEFAULT_INI_FILE, encoding="utf-8")
        
        target_fields = self.settings_cls.model_fields.items()
        for section in config.sections() + ['DEFAULT']:
            for field_name, field_info in target_fields:
                search_key = (field_info.alias or field_name).lower()
                val = config[section].get(search_key, None)
                if val is not None:
                    settings_dict[field_name] = val
                    
        return settings_dict


class Settings(BaseSettings):
    """
    Global application settings.
    """

    PROJECT_NAME: str = "Project Key"
    PROJECT_KEY: str = "project-key"
    VERSION: str = _get_version()
    LOG_LEVEL: str = Field(default="info")
    FILE_PATH: Optional[str] = Field(default=None)
    LOG_DIR: str = Field(default="logs")
    LOG_FILENAME: str = Field(default="app.log")
    UPDATE_URL: str = Field(default="https://raw.githubusercontent.com/cpadlab/project-key/refs/heads/main/VERSION")
    UPDATE_TIMEOUT: int = Field(default=5)
    DEFAULT_WINDOW_WIDTH: int = Field(default=800, alias="default_width")
    DEFAULT_WINDOW_HEIGHT: int = Field(default=600, alias="default_height")
    TEMP_DIR: str = Field(default="temp")
    HISTORY_FILENAME: str = Field(default="history.json")
    PASSWORD_AUDIT_INTERVAL: int = Field(default=30)
    PWNED_AUDIT_ENABLED: bool = Field(default=False)
    CLIPBOARD_CLEAR_INTERVAL: int = Field(default=20)
    RECYCLE_BIN_RETENTION_DAYS: int = Field(default=15)
    OTHER_SERVICES_INTERVAL: int = Field(default=60)
    BACKUP_DIR: str = Field(default="temp/backups")
    BACKUP_MAX_COUNT: int = Field(default=5)
    RECYCLE_BIN_GROUP_NAME: str = Field(default="Recycle Bin")
    PERSONAL_GROUP_NAME: str = Field(default="Personal")
    DUPLICATE_TAG: str = Field(default="duplicate", alias="duplicate")
    PWNED_TAG: str = Field(default="pwned", alias="pwned")
    WEAK_TAG: str = Field(default="weak", alias="weak")
    STATS_REFRESH_INTERVAL: int = Field(default=5)
    EMERGENCY_FILE_NAME: str = Field(default="emergency.json")
    EMERGENCY_DAYS_THRESHOLD: int = Field(default=180)
    EMERGENCY_CHECK_INTERVAL: int = Field(default=86400)
    RECOVERY_KIT_NAME: str = Field(default="recovery-kit.json")
    EMERGENCY_PASSPHRASE: str = Field(default="DefaultEmergencyPassphrase")
    MIN_WINDOW_HEIGHT: int = Field(default=500)
    MIN_WINDOW_WIDTH: int = Field(default=400)
    DEV_TOOLS: bool = Field(default=False)
    ENTRY_URL: str = Field(default="build/index.html")
    ICON: str = 'icon.ico'
    CLOSE_BEHAVIOR: str = Field(default="ask")
    ACTIVE_CONFIG_PATH: Optional[str] = Field(default=None, exclude=True)

    model_config = SettingsConfigDict(
        extra="ignore",
        validate_assignment=True,
        populate_by_name=True
    )


    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: Type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> Tuple[PydanticBaseSettingsSource, ...]:
        return (
            init_settings,
            env_settings,
            IniConfigSettingsSource(settings_cls),
        )


    def load_from_ini(self, ini_path: Path) -> None:
        """
        Load configuration values from a specified INI file dynamically.

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

        self.ACTIVE_CONFIG_PATH = str(ini_path)


    def setup_with_args(self, args: argparse.Namespace) -> None:
        """
        Apply command-line arguments to the settings instance.

        :param args: The parsed arguments object from argparse.
        :type args: argparse.Namespace
        """
        args_dict = vars(args)
        for field_name in self.model_fields.keys():
            if field_name.lower() in args_dict and args_dict[field_name.lower()] is not None:
                setattr(self, field_name, args_dict[field_name.lower()])


    def save_settings(self) -> bool:
        """
        Persist the current application settings to the active INI configuration file.

        :return: True if the settings were successfully saved to disk, False otherwise.
        :rtype: bool
        """
        path_to_save = self.ACTIVE_CONFIG_PATH or str(DEFAULT_INI_FILE)
        
        try:
            config = configparser.ConfigParser()
            if Path(path_to_save).exists():
                config.read(path_to_save, encoding="utf-8")

            for field_name, field_info in self.model_fields.items():
                if field_name == "ACTIVE_CONFIG_PATH":
                    continue
                val = getattr(self, field_name)
                config['DEFAULT'][field_name.lower()] = str(val) if val is not None else ""

            with open(path_to_save, 'w', encoding="utf-8") as configfile:
                config.write(configfile)
            return True

        except Exception as e:
            logger.error(f"Error persisting configuration to {path_to_save}: {e}")
            return False


# Global settings singleton
settings = Settings()