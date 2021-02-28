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
            let minPasswordLength = 5;
            let email = document.querySelector(".login-email-text-box").value;
            let password = document.querySelector(".login-password-text-box").value;
            if (email.indexOf('@') && password.length >= minPasswordLength){
                window.$('#Modal').modal('hide');
                fetch(`${window.location.origin}/login`,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        password: password,
                        login: email
                    }),
                    method: 'POST',
                    credentials: 'include'
                })
                    .then( (response) => { return response.json() })
                    .then( (data) => {
                        if (data){
                            informationPopup('User logged successful');
                            setLogBtn(data)
                        }
                        else{
                            informationPopup('Failed login');
                        }
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
                    setLogBtn(false)
                    informationPopup('User log out successful');
                })
            console.log("clicked");
        });
    },
    registerNewUser: function () {
        const registerBtn = document.querySelector("#registerNewUser");
        registerBtn.addEventListener("click", function () {
            let username = document.querySelector("#newUserName").value;
            let email = document.querySelector("#newUserEmail").value;
            let password = document.querySelector("#newUserPassword").value;


            let data = {
                "username": username,
                "email": email,
                "password": password
            }

            dataHandler.registerUser(data)
        });

    },
    checkUserSatus: function(){
        fetch(`${window.location.origin}/checkLogin`,{
            method: 'GET',
            headers: new Headers({
                'content-type': 'application/json'
            })
        })
            .then( (response) => {return response.json()} )
            .then( (data) => {
                setLogBtn(data)

            })
    }

};

function setLogBtn(status){
    let loginBtn = document.querySelector('.log-in-btn');
    let regBtn = document.querySelector('.reg-btn');
    let logOutBtn = document.querySelector('.log-out-btn');
    if (status){
        loginBtn.hidden = true;
        regBtn.hidden = true;
        logOutBtn.hidden = false;
    }
    else{
        loginBtn.hidden = false;
        regBtn.hidden = false;
        logOutBtn.hidden = true;
    }
}

function informationPopup(information){
        let inf_pop_title = document.querySelector('.information-popup-title')
        inf_pop_title.innerHTML = information;
        window.$('.information-popup').modal('show');
        setTimeout( () =>{window.$('.information-popup').modal('hide')}, 1000)
    }
