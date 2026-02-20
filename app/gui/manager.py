import threading

from app.utils.logger import logger
from app.controllers.updater import check_for_updates
from app.services.main import start_background_services


class GUIManager:
    """
    """
    
    
    def __init__(self):
        """
        Initialize the GUI manager.
        """
        

    def run(self) -> None:
        """
        Display the main window and start the application's event loop.

        :return: Nothing. This method blocks until the application exits.
        :rtype: None
        """
        logger.info("Starting the graphical interface...")

        update_thread = threading.Thread(target=check_for_updates, daemon=True)
        update_thread.start()

        services_thread = threading.Thread(target=start_background_services, daemon=True)
        services_thread.start()
