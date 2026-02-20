from PyQt6.QtWidgets import QMainWindow, QLabel
from PyQt6.QtCore import Qt


from app.gui.theme.colors import Colors
from app.core.config import settings


class MainWindow(QMainWindow):
    """
    Main application window for Project Key.

    This class inherits from PyQt6's QMainWindow and serves as the primary 
    graphical interface container. It is responsible for initializing the 
    window properties, applying the global theme, and setting up the central widgets.
    """


    def __init__(self):
        """
        Initialize the main window instance.
        """
        super().__init__()
        
        self.setWindowTitle(settings.PROJECT_NAME)
        self.resize(settings.DEFAULT_WINDOW_WIDTH, settings.DEFAULT_WINDOW_HEIGHT)
        
        self.setStyleSheet(f"""
            QMainWindow {{
                background-color: {Colors.DARK_BACKGROUND_MAIN};
            }}
        """)