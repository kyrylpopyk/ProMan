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


        // const privateBoardsContainer = document.querySelector("#privateBoardsContainer");
        // const publicBoardsContainer = document.querySelector("#publicBoardsContainer");
        //
        // let howManyColInRow = 5;
        // let rowPrivate = 0;
        // let rowPublic = 0;
        // let row;
        // let mainContainer;
        //
        // for(let i = 0; i < boards.length; i++) {
        //     let colPrivate = 0;
        //     let colPublic = 0;
        //     let col;
        //     if(boards[i].type === "private") {
        //         mainContainer = privateBoardsContainer;
        //     } else {
        //         mainContainer = publicBoardsContainer;
        //         }
        //     // create row
        //     let divRow = document.createElement("div");
        //     divRow.className = "row";
        //
        //     for(;col < howManyColInRow; col++) {
        //         // create col
        //         let divCol
        //
        //         let divCard = document.createElement("div");
        //         divCard.className = "card text-white bg-dark mb-3";
        //
        //
        //         let divHeader = document.createElement("div");
        //         divHeader.className = "card-header";
        //         divCard.appendChild(divHeader);
        //
        //         let linkToBoard = document.createElement("a");
        //         divHeader.appendChild(linkToBoard);
        //         linkToBoard.innerText = boards[i].title;
        //         linkToBoard.href = "#"
        //     }
        //
        //
        //
        //
        // }

        // let boardList = '';
        //
        // for(let board of boards){
        //     boardList += `
        //         <li>${board.title}</li>
        //     `;
        // }
        //
        // const outerHtml = `
        //     <ul class="board-container">
        //         ${boardList}
        //     </ul>
        // `;
        //
        // let boardsContainer = document.querySelector('.boards');
        // boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
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
            .then( (response) => {return JSON.stringify(response)} )
            .then( (data) => {
                if (data.toLowerCase() == 'true'){
                    console.log('Set header');
                }
                else{
                    console.log('Do not set headers');
                }

            })
    }

};
