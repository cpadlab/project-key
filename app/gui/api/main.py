import webview
from typing import Optional

from app.core.config import settings


class API:
    """
    """


    def __init__(self):
        self._window: Optional[webview.Window] = None


    def set_window(self, window: webview.Window):
        self._window = window

        
    def get_app_version(self) -> str:
        return settings.VERSION
    
    
    def get_app_name(self) -> str:
        return settings.PROJECT_NAME