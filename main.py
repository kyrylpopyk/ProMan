from flask import Flask, render_template, request, jsonify

from util import json_response
from flask_login import LoginManager, current_user, login_user, logout_user, login_required
from os import urandom
import util

import data_handler
import data_manager


import mimetypes
mimetypes.add_type("application/javascript", ".js", True)

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
    default_card_statuses_list = ["New", "In Progress", "Testing", "Done"]
    board_data = request.get_json()
    board_title = board_data['title']
    user_id = current_user.id
    board_id = data_handler.add_new_board(board_title, user_id)
    for default_card_status in default_card_statuses_list:
        data_handler.add_card_status(default_card_status, user_id, board_id["id"])
    statuses = data_handler.get_statuses_by_board_id(board_id['id']);

    return {'board_data': {'id': board_id['id'], 'title': board_title}, "statuses_data": statuses}

@app.route("/edit_board", methods=['POST'])
@json_response
@login_required
def edit_board():
    """
    edits boards
    """
    board_data = request.get_json()
    board_id = board_data['id']
    edited_board_title = board_data['title']
    data_handler.edit_board(board_id, edited_board_title)
    return {'title': edited_board_title, 'id': board_id}



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


@app.route("/new_card", methods=['POST'])
@json_response
@login_required
def add_new_card():
    """
    Adds new card
    """

    card_data = request.get_json()
    card_title = card_data['title']
    board_id = card_data['board_id']
    status_id = card_data['status_id']
    user_id = current_user.id
    card_data = data_handler.add_new_card(board_id, card_title, status_id, user_id)
    return card_data[0]


@app.route('/remove_board', methods=['POST'])
@json_response
@login_required
def remove_board():
    board_id = request.get_json()
    data_handler.remove_board(board_id=board_id)
    return {'id': board_id}

@app.route('/remove_card', methods=['POST'])
@json_response
def remove_card():
    card_id = request.get_json()
    data_handler.remove_card(card_id)
    return card_id


@app.route('/add-status', methods=['POST'])
@json_response
@login_required
def add_status():
    status = request.get_json()
    user_id = current_user.id
    status_data = data_handler.add_card_status(status["title"], user_id, status["board_id"])
    return {'board_id': status['board_id'], 'status_data': status_data[0]}


@app.route('/remove-status', methods=['POST'])
@json_response
@login_required
def remove_status():
    status_id = request.get_json()["status_id"]
    data_handler.remove_status(status_id)
    return {'id': status_id}


@app.route('/rename-status', methods=['POST'])
@json_response
@login_required
def rename_status():
    status = request.get_json()
    data_handler.rename_status(status)
    return {'id': status['id'], 'title': status['title']}


@app.route('/change-card-position', methods=['POST'])
@json_response
@login_required
def change_card_position():
    change_data = request.get_json()
    card_id = change_data['card_id']
    new_status_id = change_data['new_status_id']
    new_board_id = change_data['new_board_id']
    data_handler.change_card_position(card_id=card_id, new_board_id=new_board_id, new_status_id=new_status_id)
    return 'Hello'


def main():
    app.run(debug=True)

    # Serving the favicon
    # with app.app_context():
    #     app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
