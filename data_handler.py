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

class User(object):
    """An admin user capable of viewing reports.

    :param str login: email address of user
    :param str password: encrypted password for the user

    """
    #__tablename__ = 'user'

    def __init__(self,user):
        self.id = user['id']
        self.userName = user['userName']
        self.password = user['password']
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
def add_user(cursor: RealDictCursor, user):
    command = """
            INSERT INTO users("userName", email, password)
            VALUES (%(username)s, %(email)s, %(password)s)"""
    param = {
        "username": user["username"],
        "email": user["email"],
        "password": user["password"]
    }
    cursor.execute(command, param)

@connection.connection_handler
def get_password_by_email(cursor: RealDictCursor, user_email: str):
    query = """
    SELECT users.password
    FROM users
    WHERE users.email = %(user_email)s;
    """
    param = {'user_email': user_email}
    cursor.execute(query, param)
    data = cursor.fetchall()[0]['password']
    return data