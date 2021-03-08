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


@app.route("/new_board", methods=['POST'])
@json_response
@login_required
def add_new_board():
    """
    Adds new board
    """

    board_data = request.get_json()
    board_title = board_data['title']
    user_id = current_user.id
    return data_handler.add_new_board(board_title, user_id)


@app.route("/get-logins")
@json_response
def get_logins():
    return data_handler.get_logins()


@app.route("/get-boards", methods=["POST"])
@login_required
def get_user_boards_data():
    user_id = current_user.id
    board_data = data_handler.get_boards_by_user(user_id=user_id)
    cards_data = data_handler.get_cards_by_user(user_id=user_id)
    statuses_data = data_handler.get_statuses_by_user(user_id=user_id)
    data = {'boardData': board_data, 'cardsData': cards_data, 'statusesData': statuses_data}
    return jsonify(data)


@app.route("/new_card/<board_id>", methods=['POST'])
@json_response
@login_required
def add_new_card():
    """
    Adds new card
    """

    card_data = request.get_json()
    card_title = card_data['title']
    card_status = card_data['status']
    board_id = card_data['board_id']
    status_id = int(data_handler.default_card_statuses[card_status])
    user_id = current_user.id
    print(current_user)
    return data_handler.add_new_card(board_id, card_title, status_id, user_id)


@app.route('/remove_board', methods=['POST'])
def remove_board():
    board_id = request.get_json()['board_id']
    return data_handler.remove_board(board_id=board_id)

def main():
    app.run(debug=True)

    # Serving the favicon
    # with app.app_context():
    #     app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
