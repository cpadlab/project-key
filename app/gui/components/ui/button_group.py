from typing import List, Literal
from PyQt6.QtWidgets import QWidget, QHBoxLayout, QVBoxLayout

from app.gui.components.ui.button import Button


Orientation = Literal["horizontal", "vertical"]


class ButtonGroup(QWidget):
    """
    A PyQt6 port of the Shadcn/UI ButtonGroup component.
    
    Groups multiple Button components together, smoothly linking their borders 
    and border-radii just like the React/Tailwind version.
    """


    def __init__(self, buttons: List[Button], orientation: Orientation = "horizontal", parent=None):
        """
        Initialize the ButtonGroup.

        :param buttons: A list of initialized Button instances to group.
        :type buttons: List[Button]
        :param orientation: "horizontal" or "vertical" layout. Defaults to "horizontal".
        :type orientation: Orientation
        :param parent: The parent widget, if any. Defaults to None.
        """
        super().__init__(parent)

        self.orientation = orientation
        
        if orientation == "horizontal":
            self.layout = QHBoxLayout(self)
        else:
            self.layout = QVBoxLayout(self)
            
        self.layout.setSpacing(0)
        self.layout.setContentsMargins(0, 0, 0, 0)
        
        total_buttons = len(buttons)
        for i, btn in enumerate(buttons):
            if total_buttons == 1:
                btn.set_group_position("none", orientation)
            elif i == 0:
                btn.set_group_position("first", orientation)
            elif i == total_buttons - 1:
                btn.set_group_position("last", orientation)
            else:
                btn.set_group_position("middle", orientation)
        
            self.layout.addWidget(btn)