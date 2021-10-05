import bcrypt


def check_password(login_password: str, db_password: str) -> bool:
    return bcrypt.checkpw(login_password.encode('utf-8'), db_password.encode('utf-8'))