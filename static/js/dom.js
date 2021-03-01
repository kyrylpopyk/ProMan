'use strict'

// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";


export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getPrivateBoards(function(boards){
            dom.showBoards(boards, "private");
        });
        dataHandler.getPublicBoards(function (boards){
           dom.showBoards(boards, "public");
        });
    },
    showBoards: function (boards, type) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        const privateBoardsContainer = document.querySelector("#privateBoardsContainer");
        const publicBoardsContainer = document.querySelector("#publicBoardsContainer");

        let mainContainer;

        if (type === "public"){
            mainContainer = publicBoardsContainer;
        } else {
            mainContainer = privateBoardsContainer;
        }

        for (let i = 0; i < boards.length; i++) {

                // create div card
                let divCard = document.createElement("div");
                mainContainer.appendChild(divCard);
                divCard.className = "card text-white bg-dark mb-3";
                divCard.style.width = "18rem"


                let linkToBoard = document.createElement("a");
                divCard.appendChild(linkToBoard);
                linkToBoard.href = "#"

                // create div header
                let divHeader = document.createElement("div");
                divCard.appendChild(divHeader);
                divHeader.className = "card-header";
                divHeader.innerText = boards[i].title;
            }
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
            this.registerNewUser();
        });
    },
    listenNewLoginBtn:  function() {
        document.querySelector(".loginBtn").addEventListener("click", () => {
            let email = document.querySelector(".login-email-text-box").value;
            let password = document.querySelector(".login-password-text-box").value;
            if (validateUser(email, password, "login")){
                window.$('#Modal').modal('hide');
                fetch(`${window.location.origin}/login`,{
                    headers: new Headers({
                        'content-type': 'application/json'
                    }),
                    body: JSON.stringify({
                        password: password,
                        login: email
                    }),
                    method: 'POST'
                })
                    .then( (response) => { return response.json() })
                    .then( (data) => {
                        let loginBtn = document.querySelector('.log-in-btn');
                        let regBtn = document.querySelector('.reg-btn');
                        let logOutBtn = document.querySelector('.log-out-btn');
                        loginBtn.hidden = true;
                        regBtn.hidden = true;
                        logOutBtn.hidden = false;
                    })
            }
            else{
                console.log('Incorrect data!');
            }
            console.log("clicked");
        });
    },
    listenNewLogOutBtn:  function() {
        document.querySelector(".log-out-btn").addEventListener("click", () => {
            fetch(`${window.location.origin}/logout`,{
                headers: new Headers({
                    'content-type': 'application/json'
                }),
                method: 'GET'
            })
                .then(() => {
                    let loginBtn = document.querySelector('.log-in-btn');
                        let regBtn = document.querySelector('.reg-btn');
                        let logOutBtn = document.querySelector('.log-out-btn');
                        loginBtn.hidden = false;
                        regBtn.hidden = false;
                        logOutBtn.hidden = true;
                })
            console.log("clicked");
        });
    },
    registerNewUser: function () {
        const registerBtn = document.querySelector("#registerNewUser");
        registerBtn.addEventListener("click", function () {
            let email = document.querySelector("#newUserEmail").value;
            let password = document.querySelector("#newUserPassword").value;
            if (validateUser(email, password, "register")) {
                let data = {
                "email": email,
                "password": password
            }

                dataHandler.registerUser(data)
            } else {
                console.log("Incorrect data!")
            }

        });

    },
    checkUserSatus: function(){
        fetch(`${window.location.origin}/checkLogin`,{
            method: 'GET',
            headers: new Headers({
                'content-type': 'application/json'
            })
        })
            .then( (response) => {return JSON.stringify(response)} )
            .then( (data) => {
                if (data.toLowerCase() == 'true'){
                    console.log('Set header');
                }
                else{
                    console.log('Do not set headers');
                }

            })
    },


};


function validateUser (login, password, type) {
    let minLenght = 5;
    let maxLenght = 50;
    if ((login.lenght > minLenght && login.lenght < maxLenght) && (password.lenght > minLenght && password.lenght < maxLenght) && (login.indexOf("@"))) {
        if (type === "register") {
            let logins = dataHandler.getLogins();
            return !login in logins;  // if login not in logins return true else false
        }
        return true;
        }
    }