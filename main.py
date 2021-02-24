from flask import Flask, render_template, url_for, request
from util import json_response
from bcrypt import checkpw
from flask_login import LoginManager, current_user, login_user, logout_user, login_required
import os
from os import urandom

import data_handler

app = Flask(__name__)
app.secret_key = urandom(16)
login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user):
    return data_handler.User.get(user)


@app.route("/", methods=["GET", "POST"])
def index():

    """
    This is a one-pager which shows all the boards and cards
    """
    if request.method == "POST":
        register_user()
    else:
        return render_template('index.html')


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
