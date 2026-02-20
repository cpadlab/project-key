from typing import Literal, Optional
from PyQt6.QtWidgets import QPushButton
from PyQt6.QtCore import Qt, QSize
from PyQt6.QtGui import QCursor, QFont

from app.gui.theme.colors import Colors
from app.gui.theme.icons import IconManager
from app.gui.theme.fonts import get_font_sans


Variant = Literal["default", "secondary", "destructive", "outline", "ghost", "link"]
Size = Literal["default", "sm", "lg", "icon", "icon-sm", "icon-lg"]


class Button(QPushButton):
    """
    A PyQt6 port of the Shadcn/UI Button component.
    
    This custom widget supports all standard Shadcn variants, sizes, and 
    automatic SVG recoloring (mimicking the 'currentColor' CSS behavior).
    """

    def __init__(
        self, text: str = "", variant: Variant = "default", size: Size = "default", 
        svg_icon: Optional[str] = None, parent=None
    ):
        """
        Initialize the Button instance with Shadcn-like properties.

        :param text: The text label to display on the button. Defaults to "".
        :type text: str
        :param variant: The visual style variant (e.g., "default", "destructive"). Defaults to "default".
        :type variant: Variant
        :param size: The size configuration for the button. Defaults to "default".
        :type size: Size
        :param svg_icon: The raw SVG string for the icon. Defaults to None.
        :type svg_icon: Optional[str]
        :param parent: The parent widget, if any. Defaults to None.
        :type parent: Optional[QWidget]
        """
        super().__init__(text, parent)

        self.variant = variant
        self.size_config = size
        self.svg_icon = svg_icon
        
        self.setCursor(QCursor(Qt.CursorShape.PointingHandCursor))

        button_font = get_font_sans(size=10, weight=QFont.Weight.Bold) 
        self.setFont(button_font)

        self._apply_styles()


    def _apply_styles(self) -> None:
        """
        Generate and apply the Qt Style Sheets (QSS) based on the current 
        variant and size configurations, and render the SVG icon if provided.

        :return: None
        :rtype: None
        """
        size_styles = {
            "default": "height: 32px; padding: 0 16px; border-radius: 6px;",
            "sm": "height: 28px; padding: 0 10px; border-radius: 6px; font-size: 12px;",
            "lg": "height: 36px; padding: 0 20px; border-radius: 6px; font-size: 14px;",
            "icon": "height: 32px; width: 32px; padding: 0; border-radius: 6px;",
            "icon-sm": "height: 28px; width: 28px; padding: 0; border-radius: 6px;",
            "icon-lg": "height: 36px; width: 36px; padding: 0; border-radius: 6px;"
        }
        
        variant_styles = {
            "default": {
                "base": f"background-color: {Colors.PRIMARY}; color: {Colors.PRIMARY_FOREGROUND}; border: 1px solid transparent;",
                "hover": f"background-color: #c2410c;",
                "icon_color": Colors.PRIMARY_FOREGROUND
            },
            "secondary": {
                "base": "background-color: #27272a; color: #fafafa; border: 1px solid transparent;",
                "hover": "background-color: #3f3f46;",
                "icon_color": "#fafafa"
            },
            "outline": {
                "base": f"background-color: {Colors.BACKGROUND}; color: {Colors.FOREGROUND}; border: 1px solid {Colors.BORDER};",
                "hover": f"background-color: {Colors.MUTED}; color: {Colors.FOREGROUND};",
                "icon_color": Colors.FOREGROUND
            },
            "ghost": {
                "base": f"background-color: transparent; color: {Colors.FOREGROUND}; border: 1px solid transparent;",
                "hover": f"background-color: {Colors.MUTED};",
                "icon_color": Colors.FOREGROUND
            },
            "destructive": {
                "base": "background-color: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid transparent;",
                "hover": "background-color: rgba(239, 68, 68, 0.2);",
                "icon_color": "#ef4444"
            },
            "link": {
                "base": f"background-color: transparent; color: {Colors.PRIMARY}; border: 1px solid transparent; text-decoration: underline;",
                "hover": "text-decoration: underline;",
                "icon_color": Colors.PRIMARY
            }
        }

        s_style = size_styles.get(self.size_config, size_styles["default"])
        v_style = variant_styles.get(self.variant, variant_styles["default"])

        qss = f"""
            QPushButton {{
                {s_style}
                {v_style["base"]}
                outline: none;
                qproperty-iconSize: 16px 16px; 
            }}
            QPushButton:hover {{
                {v_style["hover"]}
            }}
            QPushButton:focus {{
                border: 2px solid {Colors.BORDER}; /* Shadcn focus ring */
            }}
            QPushButton:disabled {{
                opacity: 0.5; /* disabled:opacity-50 */
                background-color: {Colors.MUTED};
                color: {Colors.MUTED_FOREGROUND};
            }}
        """
        
        self.setStyleSheet(qss)

        if self.svg_icon:
            target_color = v_style["icon_color"]
            icon = IconManager.get_svg_icon(self.svg_icon, target_color)
            self.setIcon(icon)
            
            if self.text():
                self.setStyleSheet(self.styleSheet() + "QPushButton { padding-left: 12px; text-align: center; }")