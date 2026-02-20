from PyQt6.QtGui import QFontDatabase, QFont
from pathlib import Path

from app.utils.logger import logger


def load_fonts() -> None:
    """
    Scan the assets directory recursively for TTF files and register them 
    in the application font database.

    :return: None
    :rtype: None
    """
    fonts_path = Path(__file__).parent.parent / "assets" / "fonts"
    
    if not fonts_path.exists():
        logger.error(f"Fonts directory not found at: {fonts_path}")
        return

    loaded_count = 0
    for font_file in fonts_path.rglob("*.ttf"):
        font_id = QFontDatabase.addApplicationFont(str(font_file))
        if font_id == -1:
            logger.error(f"Failed to load font: {font_file.name}")
        else:
            families = QFontDatabase.applicationFontFamilies(font_id)
            logger.debug(f"Loaded {font_file.name} as family: {families}")
            loaded_count += 1
            
    logger.info(f"Successfully loaded {loaded_count} font files into the Inter family.")


def get_font_sans(size: int = 10, weight: QFont.Weight = QFont.Weight.Normal) -> QFont:
    """
    Retrieve a QFont object initialized with the 'Inter' font family.

    :param size: The desired point size for the font, defaults to 10.
    :type size: int
    :param weight: The font weight (e.g., Normal, Bold), defaults to Normal.
    :type weight: QFont.Weight
    :return: A configured QFont instance.
    :rtype: QFont
    """
    return QFont("Inter", size, weight)