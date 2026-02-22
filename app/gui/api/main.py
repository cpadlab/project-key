import webview
from typing import Optional, List, Dict

from app.core.config import settings
from app.controllers.history import get_history as get_history_controller, truncate_paths_middle


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
    
    def get_history(self) -> List[Dict[str, str]]:
        return truncate_paths_middle(get_history_controller())