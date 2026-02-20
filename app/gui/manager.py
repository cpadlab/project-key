import sys
from PyQt6.QtWidgets import QApplication

from app.gui.windows.main import MainWindow
from app.utils.logger import logger


class GUIManager:
    """
    Manage the lifecycle of the graphical user interface (GUI) and its windows.

    This class is responsible for initializing the PyQt6 application instance,
    creating the main application window, and safely executing the main event loop.
    """
    
    def __init__(self):
        """
        Initialize the GUI manager.
        """
        self.app = QApplication(sys.argv)
        self.main_window = MainWindow()

    def run(self) -> None:
        """
        Display the main window and start the application's event loop.

        :return: Nothing. This method blocks until the application exits.
        :rtype: None
        """
        logger.info("Starting the graphical interface...")
        self.main_window.show()
        sys.exit(self.app.exec())