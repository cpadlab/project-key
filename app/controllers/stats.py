import matplotlib.pyplot as plt
from matplotlib.figure import Figure
from typing import Dict, Any

from app.core.config import settings
from app.controllers.kdbx.operations import list_all_entries
from app.controllers.passwords import check_password_strength
from app.gui.theme.colors import Colors


def get_security_summary() -> Dict[str, Any]:
    """
    Analyze all vault entries and return a summary of security metrics.

    :return: A dictionary containing counts for safe, weak, duplicated, 
             and pwned passwords, along with the global health score.
    :rtype: Dict[str, Any]
    """
    entries = list_all_entries()
    total = len(entries)
    
    if total == 0:
        return {
            "total": 0, "safe": 0, "weak": 0, 
            "duplicate": 0, "pwned": 0, "score": 100.0
        }

    summary = {
        "total": total,
        "safe": 0,
        "weak": 0,
        "duplicate": 0,
        "pwned": 0,
        "total_strength_score": 0
    }

    for entry in entries:
        strength = check_password_strength(entry.password)
        summary["total_strength_score"] += strength["score"]
        
        if strength["score"] >= 3:
            summary["safe"] += 1
        else:
            summary["weak"] += 1

        if settings.DUPLICATE_TAG in entry.tags:
            summary["duplicate"] += 1
        if settings.PWNED_TAG in entry.tags:
            summary["pwned"] += 1

    summary["score"] = (summary["total_strength_score"] / (total * 4)) * 100    
    return summary


def create_security_dashboard_figure() -> Figure:
    """
    Generate a Matplotlib Figure containing the security audit charts.
    Styled for the application's dark theme.

    :return: A Matplotlib Figure object ready to be embedded in PyQt6.
    :rtype: Figure
    """
    stats = get_security_summary()
    
    fig = Figure(figsize=(8, 4), facecolor=Colors.BACKGROUND)
    ax = fig.add_subplot(111)
    ax.set_facecolor(Colors.BACKGROUND)

    labels = ['Safe', 'Weak', 'Duplicated', 'Pwned']
    sizes = [stats["safe"], stats["weak"], stats["duplicate"], stats["pwned"]]
    colors = ['#22c55e', '#eab308', '#f97316', '#ef4444']
    
    filtered_data = [(l, s, c) for l, s, c in zip(labels, sizes, colors) if s > 0]
    if not filtered_data:
        ax.text(0.5, 0.5, "No data audited yet", color='white', ha='center')
        return fig
        
    f_labels, f_sizes, f_colors = zip(*filtered_data)

    wedges, texts, autotexts = ax.pie(
        f_sizes, 
        labels=f_labels, 
        autopct='%1.1f%%', 
        startangle=140, 
        colors=f_colors,
        textprops={'color': "w", 'weight': 'bold'},
        pctdistance=0.85
    )

    centre_circle = plt.Circle((0,0), 0.70, fc=Colors.BACKGROUND)
    ax.add_artist(centre_circle)

    ax.text(
        0, 0, f"{stats['score']:.0f}%\nHealth", 
        color='white', ha='center', va='center', 
        fontsize=16, weight='bold'
    )

    ax.axis('equal')  
    fig.tight_layout()
    
    return fig