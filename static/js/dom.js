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
        let base_list_boards = document.querySelector('#lists_boards');
        let base_container = document.querySelector('#base_container');
        let base_board_name = document.querySelector('#base_board_name');
        let base_card_space = document.querySelector('#base_cards_space');
        let base_status_name = document.querySelector('#base_status_name');
        let base_card = document.querySelector('#base_card');
        let base_card_name = document.querySelector('#base_card_name');



        for (let board of boards){
            let board_container = base_container.content.cloneNode(true);
            let board_name = board_container.querySelector('#base_board_name');
            board_name.innerHTML = board['title'];
            for (let status of statuses){
                if (status['board_id'] == board['id']){
                    let status_name = base_status_name.content.cloneNode(true);
                    status_name.querySelector('#status_name').innerHTML = status['title'];
                    board_container.querySelector('#base_cards_space').appendChild(status_name);

                    for (let card of cards){
                        if ((card['status_id']) == status['id'] && card['board_id'] == board['id']){
                            let card_element = base_card.content.cloneNode(true);
                            card_element.querySelector('#base_card_name').innerHTML = card['title'];

                            board_container.querySelector('#base_cards_space').appendChild(card_element);
                        }
                    }
                }
            }
            body_element.appendChild(board_container);
        }



        /*
        * lists_boards - #lists_boards
           base_container - #base_container
           board_name - #base_board_name
           cards_space - #base_cards_space
           status_name - #base_status_name
           base_card - #base_card
           card_name - #base_card_name*/
    },
    listenNewCardBtn: function() {
        const newCardModal = document.querySelector('#newCard');
        document.querySelector("#newCardBtn").addEventListener('click', (event)=> {
          newCardModal.style.visibility = "visible";
          newCardModal.style.display = 'block';
          event.preventDefault();
        });
        dom.addNewCard();
    },


    addNewCard: function () {
        let boardId = document.querySelector('#boarId'); //do wrzucenia w template boarda!!!
        const submitCardBtn = document.querySelector("#submitCardBtn");
        submitCardBtn.addEventListener('click', function (event) {
           let newCardTitle = document.querySelector('#newCardTitle').value;
           let newCardStatus = document.querySelector('#newCardStatus').value;
           event.preventDefault();
           let newCardData = {

               'title': newCardTitle,
               'status': newCardStatus

           };

           dataHandler.addNewCard(newCardData);
        });
    },


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
        return false
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

