import threading
import webview
import sys

from app.core.config import settings
from app.utils.logger import logger
from app.controllers.updater import check_for_updates
from app.services.main import start_background_services
from .api.main import API
from app.controllers.kdbx.manager import close_current_vault


class GUIManager:
    """
    Main manager for the graphical user interface using pywebview.
    Handles window creation, lifecycle events, and background service initialization.
    """
    

    def __init__(self) -> None:
        """
        Initialize the GUI manager, configure the webview window using application 
        settings, and link the JavaScript API bridge.

        :return: None
        :rtype: None
        """
        self.api = API()

        self.entry_url = settings.ENTRY_URL

        self.window = webview.create_window(
            title=settings.PROJECT_NAME,
            url=self.entry_url,
            js_api=self.api,
            width=settings.DEFAULT_WINDOW_WIDTH,
            height=settings.DEFAULT_WINDOW_HEIGHT,
            min_size=(settings.MIN_WINDOW_WIDTH, settings.MIN_WINDOW_HEIGHT),
            frameless=False,
            easy_drag=False,
            background_color='#000000',
        )
        
        self.api.set_window(self.window)


    def _on_startup(self) -> None:
        """
        Callback executed when the webview window is successfully displayed.
        It initializes and starts the necessary background services and update checkers 
        in separate threads.

        :return: None
        :rtype: None
        """
        logger.info("Graphical interface ready. Starting background services...")

        update_thread = threading.Thread(
            target=check_for_updates, 
            daemon=True,
            name="UpdaterThread"
        )
        update_thread.start()

        services_thread = threading.Thread(
            target=start_background_services, 
            daemon=True,
            name="BackgroundServicesThread"
        )
        services_thread.start()


    def _on_closed(self) -> None:
        """
        Callback executed when the user closes the webview window.
        Ensures that the current active vault is safely closed and terminates 
        the application process.

        :return: None
        :rtype: None
        """
        logger.info("Closing the Project Key graphical interface...")
        close_current_vault()
        sys.exit(0)


    def run(self) -> None:
        """
        Bind the window lifecycle events and start the main pywebview event loop.
        This method blocks execution until the application is closed.

        :return: None
        :rtype: None
        """
        logger.info(f"Starting graphical interface at {settings.ENTRY_URL}...")

        self.window.events.shown += self._on_startup
        self.window.events.closed += self._on_closed

        webview.start(
            debug=settings.DEV_TOOLS,
        )