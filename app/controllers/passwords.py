import secrets
import string
import logging
from typing import Dict, Union

from app.core.config import settings


logger = logging.getLogger(settings.PROJECT_NAME)


def generate_password(
    length: int = 16, use_upper: bool = True, use_lower: bool = True, use_digits: bool = True, use_symbols: bool = True
) -> str:
    """
    Generate a cryptographically secure random password based on custom criteria.

    :param length: Total number of characters (default: 16).
    :type length: int
    :param use_upper: Include uppercase letters.
    :param use_lower: Include lowercase letters.
    :param use_digits: Include numeric characters.
    :param use_symbols: Include special characters (punctuation).
    :return: A secure random password string.
    :rtype: str
    """
    if length < 4:
        logger.warning("Requested password length is too short. Increasing to 4.")
        length = 4

    chars = ""
    if use_lower:
        chars += string.ascii_lowercase
    if use_upper:
        chars += string.ascii_uppercase
    if use_digits:
        chars += string.digits
    if use_symbols:
        chars += string.punctuation

    if not chars:
        logger.error("No character sets selected. Defaulting to lowercase.")
        chars = string.ascii_lowercase

    password = []
    if use_lower:
        password.append(secrets.choice(string.ascii_lowercase))
    if use_upper:
        password.append(secrets.choice(string.ascii_uppercase))
    if use_digits:
        password.append(secrets.choice(string.digits))
    if use_symbols:
        password.append(secrets.choice(string.punctuation))

    password += [secrets.choice(chars) for _ in range(length - len(password))]
    secrets.SystemRandom().shuffle(password)
    return "".join(password)


def check_password_strength(password: str) -> Dict[str, Union[int, str]]:
    """
    Evaluate the strength of a password based on length, entropy, and diversity.

    Levels are calculated as:
    - 0-1: Weak (Very dangerous)
    - 2: Fair (Better but not enough)
    - 3: Good (Safe for non-critical accounts)
    - 4: Strong (Professional standard)

    :param password: The password string to analyze.
    :return: A dictionary with 'score' (0-4) and 'label' (e.g., 'Strong').
    :rtype: Dict[str, Union[int, str]]
    """
    score = 0
    length = len(password)

    if not password:
        return {"score": 0, "label": "Empty"}

    if length >= 8:  score += 1
    if length >= 12: score += 1
    
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digits = any(c.isdigit() for c in password)
    has_symbols = any(c in string.punctuation for c in password)
    
    types_count = sum([has_upper, has_lower, has_digits, has_symbols])
    
    if types_count >= 3:
        score += 1
    if types_count == 4 and length >= 10:
        score += 1

    labels = {
        0: "Very Weak",
        1: "Weak",
        2: "Fair",
        3: "Good",
        4: "Strong"
    }

    final_score = min(score, 4)
    
    return {
        "score": final_score,
        "label": labels[final_score]
    }