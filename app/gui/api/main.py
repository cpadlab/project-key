import webview
from typing import Optional

from app.core.config import settings


class API:
    """
    """


    def __init__(self):
        self._window: Optional[webview.Window] = None


    def get_app_version(self) -> str:
        return settings.VERSION