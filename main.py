import argparse
from pathlib import Path

from app.cli import get_args
from app.core.config import settings


def main(arguments: argparse.Namespace):
    """
    """
    settings.load_from_ini(Path(arguments.config_file))
    settings.setup_with_args(arguments)


if __name__ == "__main__":
    main(arguments=get_args())