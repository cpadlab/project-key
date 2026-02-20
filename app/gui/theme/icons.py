import xml.etree.ElementTree as ET
from PyQt6.QtGui import QIcon, QPixmap, QImage, QPainter
from PyQt6.QtCore import Qt, QByteArray
from PyQt6.QtSvg import QSvgRenderer
from pathlib import Path


class IconManager:
    """
    Manager for rendering dynamic SVG icons (e.g., Lucide) by allowing 
    the injection of a specific color into the 'currentColor' placeholder.
    """


    def load_svg_asset(filename: str) -> str:
        """
        Read an SVG file from the application's assets directory.

        :param filename: The name of the SVG file (e.g., 'open-folder.svg').
        :type filename: str
        :return: The raw string content of the SVG file, or an empty string if not found.
        :rtype: str
        """
        current_dir = Path(__file__).resolve().parent
        svg_path = current_dir.parent / "assets" / "icons" / filename
        
        try:
            return svg_path.read_text(encoding="utf-8")
        except FileNotFoundError:
            logger.error(f"Failed to load SVG icon: File not found at {svg_path}")
            return ""


    @staticmethod
    def get_svg_icon(svg_content: str, color: str, size: int = 24) -> QIcon:
        """
        Process an SVG string, replacing 'currentColor' with a specific hex color, 
        and convert it into a QIcon.

        :param svg_content: The raw SVG string content.
        :type svg_content: str
        :param color: The hexadecimal color code to inject (e.g., '#fafafa').
        :type color: str
        :param size: The target width and height of the icon in pixels. Defaults to 24.
        :type size: int
        :return: The generated PyQt6 QIcon instance.
        :rtype: QIcon
        """
        modified_svg = svg_content.replace('currentColor', color)
        
        renderer = QSvgRenderer(QByteArray(modified_svg.encode('utf-8')))
        
        image = QImage(size, size, QImage.Format.Format_ARGB32)
        image.fill(Qt.GlobalColor.transparent)
        
        painter = QPainter(image)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        renderer.render(painter)
        painter.end()
        
        pixmap = QPixmap.fromImage(image)
        icon = QIcon(pixmap)
        
        return icon