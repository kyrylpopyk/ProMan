'use strict';

// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";


export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },
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
                            setLogBtn(data);
                            dataHandler.makeBoards()
                        }
                        else{
                            informationPopup('Failed login');
                        }
                    });
            }
            else{
                console.log('Incorrect data!');
            }
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
    listenNewBoardBtn: function() {
        const newBoardModal = document.querySelector('#newBoard');
        document.querySelector("#newBoardBtn").addEventListener('click', ()=> {
          newBoardModal.style.visibility = "visible";
          newBoardModal.style.display = 'block';
        });
        this.addNewBoard();
    },

    addNewBoard: function () {
        const newBoardBtn = document.querySelector(".addBoardBtn");
        newBoardBtn.addEventListener('click', function () {
           let newBoardTitle = document.querySelector('#newBoardTitle').value;
           let newBoardData = {

               'title': newBoardTitle
           };

           dataHandler.addNewBoard(newBoardData, appendBoardToHTML);
        });
    },

    registerNewUser: function () {
        const registerBtn = document.querySelector("#registerNewUser");
        registerBtn.addEventListener("click", function () {
            let  username = document.querySelector("#newUsername").value;
            let email = document.querySelector("#newUserEmail").value;
            let password = document.querySelector("#newUserPassword").value;
            if (validateUser(email, password, "register")) {
                let data = {
                "username": username,
                "login": email,
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
            .then( (response) => {return response.json()} )
            .then( (data) => {
                setLogBtn(data);
                if (data){
                    dataHandler.makeBoards();
                }
            });
    },
    showBoard: function (boards, statuses, cards) {
        let body_element = document.querySelector('#body');
        for (let board of boards){
            body_element.appendChild(createNewBoard(board, statuses, cards))
        }
    },
    listenNewCardBtn: function(boardId, statusId) {

        const newCardModal = document.querySelector('#newCardModal');
        newCardModal.style.visibility = "visible";
        newCardModal.style.display = 'block';
        dom.addNewCard(boardId, statusId);
    },

    listenRemoveCard: function(cardId) {
        dataHandler.removeCard(cardId);
    },


    addNewCard: function (boardId, statusId) {

        const submitCardBtn = document.querySelector("#submitCardBtn");
        submitCardBtn.addEventListener('click', function (event) {
           let newCardTitle = document.querySelector('#newCardTitle').value;
           event.preventDefault();
           let newCardData = {

               'title': newCardTitle,
               'board_id': boardId,
               'status_id': statusId

           };
           dataHandler.addNewCard(newCardData);
           let modal = document.querySelector('#newCardModal');
           modal.style.visibility = 'hidden';
            location.reload();
        });
    },
    listenNewRemoveBoard: function (board_id){
        dataHandler.removeBoard(board_id, removeBoardFromHTML);
    }


};
function validateUser (login, password, type) {
    let minLength = 5;
    let maxLength = 50;
    if ((login.length > minLength && login.length < maxLength) && (password.length > minLength && password.length < maxLength) && (login.indexOf("@"))) {
        // if (type === "register") {
        //     let logins = dataHandler.getLogins();
        //     return !login in logins;  // if login not in logins return true else false
        // }
        return true;
    } else {
        return false;
    }
}

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

function saveDataById(board_id, data){
    let new_data = [];
    for (let i = 0; i < data.length; i++){
        if (data[i]['board_id'] == board_id){
            new_data.push(data[i]);
        }
    }
    return new_data;
}

function functionAdd(board_id, status_id) {
    dom.listenNewCardBtn(board_id, status_id);
}



function createNewBoard(boardData, statusesData, cardsData){
    let base_container = document.querySelector('#base_container');
    let board_container = base_container.content.cloneNode(true);
    let remove_board_btn = board_container.querySelector('#remove_board_btn');

    board_container.firstElementChild.id = boardData['id'];
    board_container.querySelector('#base_board_name').innerHTML = boardData['title'];
    remove_board_btn.addEventListener('click', () => {
        dom.listenNewRemoveBoard(boardData['id']);
    });
    if (statusesData !== null){
        for (let status of statusesData){
            if (status['board_id'] == boardData['id']) {
                board_container.querySelector('#base_statuses_space').appendChild(createNewStatus(status, cardsData, boardData['id']));
            }
        }
    }

    let addBtnList = board_container.querySelectorAll('#newCardBtn');
    let actualStatuses = saveDataById(boardData['id'], statusesData);
    console.log(actualStatuses);
    for (let i = 0; i < actualStatuses.length; i++) {
        addBtnList[i].addEventListener('click', (event) => {
            event.preventDefault();
            functionAdd(boardData['id'], actualStatuses[i]['id']);
        });

    }

    return board_container
}

function createNewStatus(statusData, cardsData=null){
    let base_status_name = document.querySelector('#base_status');
    let status_name = base_status_name.content.cloneNode(true);
    status_name.querySelector('#status_name').innerHTML = statusData['title'];
    if (cardsData != null){
        for (let card of cardsData){
            if (card['status_id'] == statusData['id']){
                status_name.querySelector('#base_cards_space').appendChild(createNewCard(card));
            }
        }
    }
    return status_name
}

function createNewCard(cardData){
    let base_card = document.querySelector('#base_card');
    let card_element = base_card.content.cloneNode(true);
    card_element.querySelector('#base_card_name').innerHTML = cardData['title'];
    return card_element;
}

function appendBoardToHTML(response){
    const boardData = response['board_data'];
    const statusesData = response['statuses_data'];
    const body_element = document.querySelector('#body');
    body_element.appendChild(createNewBoard(boardData, statusesData));
}

function removeBoardFromHTML(response){
    const boardsHTML = document.querySelector('#body').querySelectorAll('.content-board-list')
    const board_id = response['id'];
    for (let board of boardsHTML){
        if (board.id == board_id){
            board.remove();
        }
    }
}




