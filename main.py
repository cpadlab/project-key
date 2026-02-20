import argparse
from pathlib import Path

from app.utils.logger import logger, update_logger_level
from app.utils.cli import get_args
from app.core.config import settings
from app.controllers.updater import check_for_updates


def main(arguments: argparse.Namespace):
    """
    """
    settings.load_from_ini(Path(arguments.config_file))
    settings.setup_with_args(arguments)

    update_logger_level()

    logger.info(f"--- {settings.PROJECT_NAME} v{settings.VERSION} initialized ---")
    logger.debug(f"Configuration loaded from: {arguments.config_file}")
    logger.info(f"Log level set to: {settings.LOG_LEVEL}")
    
    if settings.FILE_PATH:
        logger.info(f"Database file: {settings.FILE_PATH}")
    else:
        logger.info("No database file specified")

    check_for_updates()


if __name__ == "__main__":
    main(arguments=get_args())