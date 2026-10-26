import re

def validate_email(email):
    """Validates an email address format."""
    return re.match(r"[^@]+@[^@]+\.[^@]+", email) is not None

def validate_password(password):
    """Validates password strength (at least 8 characters)."""
    return len(password) >= 8

def validate_username(username):
    """Validates username format (alphanumeric, 3-20 characters)."""
    return re.match(r"^[a-zA-Z0-9_]{3,20}$", username) is not None

def validate_temperature(temp):
    """Validates temperature is a number."""
    return isinstance(temp, (int, float))

def validate_threshold(threshold):
    return isinstance(threshold, int) and 0 <= threshold <= 100