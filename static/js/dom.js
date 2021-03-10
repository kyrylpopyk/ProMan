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

           dataHandler.addNewBoard(newBoardData);
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

            })
    },
    showBoard: function (boards, statuses, cards) {
        let body_element = document.querySelector('#body');
        let base_container = document.querySelector('#base_container');
        let base_status_name = document.querySelector('#base_status');
        let base_card = document.querySelector('#base_card');

        for (let board of boards){
            let board_container = base_container.content.cloneNode(true);
            let board_name = board_container.querySelector('#base_board_name');
            let remove_board_btn = board_container.querySelector('#remove_board_btn');
            remove_board_btn.addEventListener('click', () => {
                this.listenNewRemoveBoard(board['id']);
            });



            board_name.innerHTML = board['title'];
            for (let status of statuses){
                if (status['board_id'] == board['id']){
                    let status_name = base_status_name.content.cloneNode(true);
                    status_name.querySelector('#status_name').innerHTML = status['title'];


                    for (let card of cards){
                        if ((card['status_id']) == status['id'] && card['board_id'] == board['id']){
                            let card_element = base_card.content.cloneNode(true);
                            card_element.querySelector('#base_card_name').innerHTML = card['title'];
                            status_name.querySelector('#base_cards_space').appendChild(card_element);

                        }

                    }
                    board_container.querySelector('#base_statuses_space').appendChild(status_name);
                }
            }
            let addBtnList = board_container.querySelectorAll('#newCardBtn');
            let actualStatuses = saveDataById(board['id'], statuses);
            for (let i = 0; i < actualStatuses.length; i++){
                addBtnList[i].addEventListener('click', (event) => {
                    event.preventDefault();
                    functionAdd(board['id'], actualStatuses[i]['id']);
                })
            }
            body_element.appendChild(board_container);
        }
    },
    listenNewCardBtn: function(boardId, statusId) {
        console.log('karta');
        const newCardModal = document.querySelector('#newCardModal');
        newCardModal.style.visibility = "visible";
        newCardModal.style.display = 'block';
        dom.addNewCard(boardId, statusId);
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
        });
    },
    listenNewRemoveBoard: function (board_id){
        fetch(`${window.location.origin}/remove_board`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                board_id: JSON.stringify(board_id)
            }),
            method: 'POST',
            credentials: 'include'
        })
            .then( response => response.json())
            .then( response => console.log(response));
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
    return new_data
}

function functionAdd(board_id, status_id) {
    dom.listenNewCardBtn(board_id, status_id);
}


