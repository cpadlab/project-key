import argparse
from typing import List, Any, Dict

from app.core.config import settings, DEFAULT_INI_FILE


ARGUMENTS: List[Dict[str, Any]] = [
    {
        "flags": ['-v', '--version'],
        "action": 'version',
        "version": f'%(prog)s {settings.VERSION}',
        "help": "Shows the current version of the programme"
    },
    {
        "flags": ['-l', '--log-level'],
        "dest": "log_level",
        "choices": ['debug', 'info', 'medium', 'error', 'critical'],
        "help": "Set the logging verbosity level"
    },
    {
        "flags": ['-f', '--file'],
        "type": str,
        "metavar": "PATH",
        "help": "Path to the password database file"
    },
    {
        "flags": ['-c', '--config'],
        "dest": "config_file",
        "default": DEFAULT_INI_FILE,
        "help": f"Path to the configuration file (default: {DEFAULT_INI_FILE})"
    },
]


def get_args() -> argparse.Namespace:
    """
    Configure and parse command-line arguments for Project Key.

    :return: An object containing the parsed command-line arguments.
    :rtype: argparse.Namespace
    """
    parser = argparse.ArgumentParser(
        prog=settings.PROJECT_NAME
    )

    for argument in ARGUMENTS:
        argument_config = argument.copy()
        flags = argument_config.pop("flags") 
        parser.add_argument(*flags, **argument_config)
    
    return parser.parse_args()