'use strict'

// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for(let board of boards){
            boardList += `
                <li>${board.title}</li>
            `;
        }

        const outerHtml = `
            <ul class="board-container">
                ${boardList}
            </ul>
        `;

        let boardsContainer = document.querySelector('.boards');
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    // here comes more features


    listenNewUserBtn:  function() {
        document.querySelector("#newUserBtn").addEventListener("click", () => {
            document.querySelector("#newUser").style.visibility = "visible";
            document.querySelector("#newUser").style.display = 'block';
            console.log("clicked");
        });
    },
    listenNewLoginBtn:  function() {
        document.querySelector(".loginBtn").addEventListener("click", () => {
            let minPasswordLength = 5;
            let logBtn = document.querySelector(".loginBtn");
            let email = document.querySelector(".login-email-text-box").value;
            let password = document.querySelector(".login-password-text-box").value;
            if (email.indexOf('@') && password.length >= minPasswordLength){
                window.$('#Modal').modal('hide');
            }
            else{
                console.log('Incorrect data!');
            }
            console.log("clicked");
        });
    },
    registerNewUser: function () {
        const registerForm = document.querySelector("#registerUserForm");
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const formData = new FormData(this);
            dataHandler.registerUser(formData)
        });

    }

};
