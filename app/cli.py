import argparse
from typing import List, Any

from app._version import _VERSION


ARGUMENTS: List[Any] = [
    {
        "flags": ['-v', '--version'],
        "action": 'version',
        "version": f'%(prog)s {_VERSION}',
        "help": "Shows the current version of the programme."
    },
    {
        "flags": ['-l', '--log-level'],
        "dest": "log_level",
        "choices": ['debug', 'info', 'medium', 'error', 'critical'],
        "default": 'info',
        "help": "Set the logging verbosity level (default: %(default)s)."
    },
    {
        "flags": ['-f', '--file'],
        "type": str,
        "metavar": "PATH",
        "help": "Path to the password database file"
    }
]


def get_args() -> argparse.Namespace:
    """
    Configure and parse command-line arguments for Project Key.

    :return: An object containing the parsed command-line arguments.
    :rtype: argparse.Namespace
    """
    parser = argparse.ArgumentParser(
        prog="Project Key"
    )

    for argument in ARGUMENTS:
        flags = argument.pop("flags") 
        parser.add_argument(*flags, **argument)
    
    return parser.parse_args()