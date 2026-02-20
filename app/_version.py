import os


_current_dir = os.path.dirname(os.path.abspath(__file__))
_version_file = os.path.join(_current_dir, "..", "VERSION")


def _get_version():
    """
    """
    try:
        with open(_version_file, "r", encoding="utf-8") as f:
            return f.read().strip()
    except FileNotFoundError:
        return "unknown"


_VERSION = _get_version()
_TITLE = "Project Key"