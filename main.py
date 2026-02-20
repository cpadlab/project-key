import argparse
from pathlib import Path
from app.utils.logger import logger

from app.cli import get_args
from app.core.config import settings


def main(arguments: argparse.Namespace):
    """
    """
    settings.load_from_ini(Path(arguments.config_file))
    settings.setup_with_args(arguments)

    logger.info(f"--- {settings.PROJECT_NAME} v{settings.VERSION} initialized ---")
    logger.debug(f"Configuration loaded from: {arguments.config_file}")
    logger.info(f"Log level set to: {settings.LOG_LEVEL}")
    logger.info(f"Database file: {settings.FILE_PATH}")


if __name__ == "__main__":
    main(arguments=get_args())