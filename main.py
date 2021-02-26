from flask import Flask, render_template, url_for, request, jsonify

from util import json_response
from bcrypt import checkpw
from flask_login import LoginManager, current_user, login_user, logout_user, login_required
import os
from os import urandom

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


@app.route("/", methods=["GET", "POST"])
def index():

    """
    This is a one-pager which shows all the boards and cards
    """
    if request.method == "POST":
        register_user()
    else:
        return render_template('index.html')


@app.route('/login', methods=['POST'])
def user_login():

    login_data = request.get_json()
    user_data = data_handler.get_user_by_login(login_data.get('login'))
    if data_manager.check_password(login_password=login_data['password'], db_password=user_data['passwordhash']):
        user = data_handler.User(user_data)
        login_user(user)
        _current_user = current_user
        return jsonify('You are logged in')
    else:
        return jsonify('Failed login')


@app.route('/logout', methods=['GET'])
@login_required
def logout():
    data = current_user
    if current_user.is_authenticated:
        logout_user()
    return jsonify('You have logged out')


@app.route('/checkLogin', methods=['GET'])
def check_login():

    return jsonify(True) if current_user.is_authenticated else jsonify(False)



def register_user(data):
    pass


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
