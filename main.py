import logging
import argparse
from pathlib import Path

from app.utils.logger import logger
from app.utils.cli import get_args
from app.core.config import settings


def main(arguments: argparse.Namespace):
    """
    """
    settings.load_from_ini(Path(arguments.config_file))
    settings.setup_with_args(arguments)
    
    new_logging_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    logger.setLevel(new_logging_level)
    for handler in logger.handlers:
        handler.setLevel(new_logging_level)

    logger.info(f"--- {settings.PROJECT_NAME} v{settings.VERSION} initialized ---")
    logger.debug(f"Configuration loaded from: {arguments.config_file}")
    logger.info(f"Log level set to: {settings.LOG_LEVEL}")
    logger.info(f"Database file: {settings.FILE_PATH}")


if __name__ == "__main__":
    main(arguments=get_args())