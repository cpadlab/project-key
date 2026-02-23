import threading
import os
import webview
import pystray
from PIL import Image
import sys
import platform
import ctypes

from app.core.config import settings, _BASE_DIR
from app.utils.logger import logger
from app.controllers.updater import check_for_updates
from app.services.main import start_background_services
from .api.main import API
from app.controllers.kdbx.manager import close_current_vault
from app.utils.file import validate_entry_url


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
        if platform.system() == 'Windows':
            myappid = f'cpadlab.{settings.PROJECT_NAME}.gui.{settings.VERSION}'
            ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID(myappid)

        self.api = API()
        self._is_shutting_down = False
        
        self.entry_url = settings.ENTRY_URL
        GUIManager._validate_resource(entry_url=self.entry_url)

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


    @staticmethod
    def _validate_resource(entry_url: str = settings.ENTRY_URL) -> None:
        """
        Verify the availability of the application's entry point before 
        initializing the interface.

        :param entry_url: The URL or filesystem path to validate. 
        :type entry_url: str
        :return: None
        :rtype: None
        """
        logger.info(f"Validating input resource: {entry_url}...")
        if not validate_entry_url(entry_url):
            if settings.DEV_TOOLS:
                logger.critical(
                    f"Entry point not found: '{entry_url}'. "
                    "Tip: Since DEV_TOOLS is enabled, make sure you have run "
                    "'npm install' and 'npm run build' in the frontend directory."
                )
            else:
                logger.critical(f"Unable to access ENTRY_URL '{entry_url}'.")
            sys.exit(1)


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


    def _on_closing(self) -> bool:
        """
        Intercept the window closing event. 

        :return: True to proceed with closing the window, False to cancel and hide.
        :rtype: bool
        """
        if self._is_shutting_down:
            logger.info("Proceeding to close application...")
            return True 
            
        logger.info("Minimizing to tray instead of closing...")
        self.window.hide()
        return False


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
        self.window.events.closing += self._on_closing

        self._setup_tray()

        absolute_icon_path = str((_BASE_DIR / settings.ICON).resolve())
        logger.debug(f"Loading window icon from absolute path: {absolute_icon_path}")

        webview.start(
            debug=settings.DEV_TOOLS,
            icon=absolute_icon_path
        )


    def _setup_tray(self) -> None:
        """
        Configure and initialize the system tray icon.
        Runs in a separate thread to coexist with the pywebview event loop 
        without blocking the main thread.

        :return: None
        :rtype: None
        """
        def show_app(icon, item):
            self.window.show()

        def hide_app(icon, item):
            self.window.hide()

        def exit_app(icon, item):
            self._is_shutting_down = True
            icon.stop()
            self.window.destroy()

        tray_menu = pystray.Menu(
            pystray.MenuItem('Show App', show_app, default=True),
            pystray.MenuItem('Hide App', hide_app),
            pystray.MenuItem('Exit Application', exit_app)
        )

        try:
            image = Image.open(settings.ICON) 
        except FileNotFoundError:
            from PIL import ImageDraw
            image = Image.new('RGB', (64, 64), color='black')
            ImageDraw.Draw(image).text((15, 25), "App", fill='white')

        self.tray_icon = pystray.Icon(
            name=settings.PROJECT_KEY, 
            icon=image, 
            title=settings.PROJECT_NAME, 
            menu=tray_menu
        )

        tray_thread = threading.Thread(
            target=self.tray_icon.run, 
            daemon=True, 
            name="TrayIconThread"
        )
        tray_thread.start()