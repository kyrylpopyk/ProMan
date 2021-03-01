from flask import Flask, render_template, url_for, request, jsonify

from util import json_response
from bcrypt import checkpw
from flask_login import LoginManager, current_user, login_user, logout_user, login_required
import os
from os import urandom
import util

import data_handler
import data_manager


app = Flask(__name__)
app.secret_key = urandom(16)
login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id: str):
    user_data = data_handler.get_user_by_id(user_id)
    user = data_handler.User(user_data)
    print('Load user function')
    return user


@app.route("/")
def index():

    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/register", methods=["POST"])
@json_response
def register_user():

    form_data = request.get_json()
    logins = data_handler.get_logins()
    logins_list = []
    for i in range(len(logins)):
        logins_list.append(logins[i]["login"])
    if form_data["login"] not in logins_list:
        hash_password = util.password_encryption(form_data["password"])
        form_data["password"] = hash_password.decode('UTF-8')
        data_handler.add_user(form_data)
        return "You have been registered"
    else:
        return "Account exists for this email address. You can log in"


@app.route('/login', methods=['POST'])
def user_login():

    try:
        login_data = request.get_json()
        user_data = data_handler.get_user_by_login(login_data.get('login'))
        if 'id' in user_data:
            if data_manager.check_password(login_password=login_data['password'],
                                           db_password=user_data['passwordhash']):
                user = data_handler.User(user_data)
                login_user(user)
                _current_user = current_user
                resp = app.make_response(jsonify('True'))
                resp.set_cookie('id', str(user_data['id']))
                return resp

        return jsonify(False)
    except Exception():
        return jsonify(False)


@app.route('/logout', methods=['GET'])
@login_required
def logout():
    resp = app.make_response(jsonify('You have logged out'))
    resp.set_cookie('id', '')
    if current_user.is_authenticated:
        logout_user()
    return resp


@app.route('/checkLogin', methods=['GET'])
def check_login():

    return jsonify(True) if current_user.is_authenticated else jsonify(False)


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route("/get-private-boards")
@json_response
def get_private_boards():
    return data_handler.get_boards_by_type("private")


@app.route("/get-public-boards")
@json_response
def get_public_boards():
    return data_handler.get_boards_by_type("public")


@app.route("/get-cards/<int:board_id>")

@app.route("/new_board", methods=['POST'])
@json_response
def add_new_board():
    """
    Adds new board
    """
    print("ok")
    board_data = request.get_json()
    board_title = board_data['title']
    print(board_title)
    user_id = current_user.id
    print(user_id)
    return data_handler.add_new_board(board_title,user_id)



# @app.route("/get-cards/<int:board_id>")
# @json_response
# def get_cards_for_board(board_id: int):
#     """
#     All cards that belongs to a board
#     :param board_id: id of the parent board
#     """
#     return data_handler.get_cards_for_board(board_id)



@app.route("/get-logins")
@json_response
def get_logins():
    return data_handler.get_logins()


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
