from functools import wraps
from flask import jsonify
import bcrypt


def json_response(func):
    """
    Converts the returned dictionary into a JSON response
    :param func:
    :return:
    """
    @wraps(func)
    def decorated_function(*args, **kwargs):
        return jsonify(func(*args, **kwargs))

    return decorated_function


def password_encryption(password):
    hash_bytes = bcrypt.hashpw(password.encode("UTF-8"), bcrypt.gensalt())
    return hash_bytes
