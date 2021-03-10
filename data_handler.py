# import Persistence
import connection
from psycopg2.extras import RealDictCursor, DictCursor
import bcrypt

# def get_card_status(status_id):
#  """
#  Find the first status matching the given id
#  :param status_id:
#  :return: str
#  """
#  statuses = Persistence.get_statuses()
#  return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')
#
#
# # def get_boards():
# #  """
# #  Gather all boards
# #  :return:
# #  """
# #  return Persistence.get_boards(force=True)
#
# def get_cards_for_board(board_id):
#  Persistence.clear_cache()
#  all_cards = Persistence.get_cards()
#  matching_cards = []
#  for card in all_cards:
#      if card['board_id'] == str(board_id):
#          card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
#          matching_cards.append(card)
#  return matching_cards

default_card_statuses = {"new": 1, "progress": 2, "testing": 3, "done": 4}


class User(object):
    """An admin user capable of viewing reports.

    :param str login: email address of user
    :param str password: encrypted password for the user

    """
    #__tablename__ = 'user'

    def __init__(self, user):
        self.id = user['id']
        self.login = user['login']
        self.userName = user['username']
        self.password = user['passwordhash']

        self.authenticated = True


    def is_active(self):
        """True, as all users are active."""
        return True

    def get_id(self):
        """Return the email address to satisfy Flask-Login's requirements."""
        return self.id

    def is_authenticated(self):
        """Return True if the user is authenticated."""
        return self.authenticated

    def is_anonymous(self):
        """False, as anonymous users aren't supported."""
        return False



@connection.connection_handler
def get_boards(cursor: RealDictCursor) -> list:
    query = """
        SELECT *
        FROM boards
        ORDER BY id
        """
    cursor.execute(query)
    return cursor.fetchall()


@connection.connection_handler
def get_users(cursor: RealDictCursor) -> list:
    query = """
        SELECT *
        FROM users
        ORDER BY id
        """
    cursor.execute(query)
    return cursor.fetchall()

@connection.connection_handler
def add_user(cursor: RealDictCursor, user):
    command = """
             INSERT INTO users(username, login, passwordhash)
            VALUES (%(username)s, %(login)s, %(passwordhash)s)
            """
    param = {
        "username": user["username"],
        "login": user["login"],
        "passwordhash": user["password"]
    }
    cursor.execute(command, param)


@connection.connection_handler
def get_user_by_login(cursor: RealDictCursor, user_login: str) -> str:
    query = """
    SELECT *
    FROM users
    WHERE users.login = %(user_login)s;
    """
    param = {'user_login': user_login}
    cursor.execute(query, param)
    password = cursor.fetchall()
    return password[0] if len(password) > 0 else {}


@connection.connection_handler
def get_user_by_id(cursor: RealDictCursor, id: str):
    query = """
        SELECT *
        FROM users
        WHERE users.id = %(id)s;
        """
    param = {'id': id}
    cursor.execute(query, param)
    return cursor.fetchall()[0]



@connection.connection_handler
def add_new_board(cursor: RealDictCursor, board_title, user_id):
    command = """
            INSERT INTO boards(title, user_id, type)
            VALUES  (%(title)s, %(user_id)s, %(type)s)
            RETURNING id
            """
    param = {
        "title": board_title,
        "user_id": user_id,
        "type": "public"
    }
    cursor.execute(command, param)
    return cursor.fetchone()


@connection.connection_handler
def get_boards_by_type(cursor: RealDictCursor, type):
    query = """
            SELECT *
            FROM boards
            WHERE boards.type = %(type)s """

    param = {
        "type": type
    }
    cursor.execute(query, param)
    return cursor.fetchall()


@connection.connection_handler
def get_logins(cursor: RealDictCursor) -> list:
    query = """
            SELECT login
            FROM users"""

    cursor.execute(query)
    return cursor.fetchall()

@connection.connection_handler
def get_board_by_id(cursor: RealDictCursor, board_id):
    query = """
            SELECT *
            FROM boards
            WHERE id = %(board_id)s"""

    param = {
        "board_id": board_id
    }
    cursor.execute(query, param)
    return cursor.fetchone()

@connection.connection_handler
def get_board_by_id(cursor: RealDictCursor, board_id):
    query = """
            SELECT *
            FROM boards
            WHERE id = %(board_id)s"""

    param = {
        "board_id": board_id
    }
    cursor.execute(query, param)
    return cursor.fetchone()


@connection.connection_handler
def get_cards_by_board_id(cursor: RealDictCursor, board_id):
    query = """
               SELECT *
               FROM cards
               WHERE id = %(board_id)s"""

    param = {
        "board_id": board_id
    }
    cursor.execute(query, param)
    return cursor.fetchall()

@connection.connection_handler
def get_statuses_by_user(cursor: RealDictCursor, user_id: int):
    query = """
        SELECT * FROM statuses
        where user_id = %(user_id)s;
    """

    param = {'user_id': user_id}
    cursor.execute(query, param)
    return cursor.fetchall()

@connection.connection_handler
def get_boards_by_user(cursor: RealDictCursor, user_id: int):
    query = """
        SELECT boards.id, boards.title, boards.type
        FROM boards
        where user_id = %(user_id)s;
    """
    param = {'user_id': user_id}
    cursor.execute(query, param)
    return cursor.fetchall()

@connection.connection_handler
def get_cards_by_user(cursor: RealDictCursor, user_id: int):
    query = """
        SELECT cards.id, cards.board_id, cards.title, cards.status_id
        FROM cards
        where user_id = %(user_id)s;
    """
    param = {'user_id': user_id}
    cursor.execute(query, param)
    return cursor.fetchall()


@connection.connection_handler
def add_new_card(cursor: RealDictCursor, board_id, card_title, status_id, user_id):
    command = """
            INSERT INTO cards(board_id, title, status_id, user_id)
            VALUES  (%(board_id)s, %(title)s, %(status_id)s, %(user_id)s)
            """
    param = {
        "board_id": board_id,
        "title": card_title,
        "status_id": status_id,
        "user_id": user_id,
    }
    cursor.execute(command, param)


@connection.connection_handler
def remove_board(cursor: RealDictCursor, board_id: str):
    command = """
    DELETE FROM boards 
    WHERE boards.id = %(board_id)s;
    """
    param = {'board_id': board_id}
    try:
        cursor.execute(command, param)
        return True
    except Exception:
        return False

@connection.connection_handler
def add_card_status(cursor: RealDictCursor, status_tittle, user_id, board_id):
    command = """INSERT INTO statuses(title, user_id, board_id) 
                 VALUES (%(title)s, %(user_id)s, %(board_id)s)"""

    param = {
        "title": status_tittle,
        "user_id": user_id,
        "board_id": board_id
    }
    cursor.execute(command, param)
