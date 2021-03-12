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
            if (validateUser(email, password)){
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

    listenEditBoardBtn: function(board) {
        const editBoardModal = document.querySelector('#editBoard');
        const submitEditedBoardBtn = editBoardModal.querySelector('#submitEditedBoardBtn')
        let boardTitleToEdit = editBoardModal.querySelector('#editedTitle');
        boardTitleToEdit.textContent = board['title'];
        let boardId = board['id'];
        editBoardModal.style.visibility = "visible";
        editBoardModal.style.display = 'block';
        submitEditedBoardBtn.addEventListener('click', (event) => {
            event.preventDefault();

            let editedBoardData = {

                'id': boardId,
                'title': boardTitleToEdit.value
            };
            dataHandler.editBoard(editedBoardData);
            editBoardModal.style.visibility = 'hidden';
        });
    },


    addNewBoard: function () {
        const newBoardBtn = document.querySelector(".addBoardBtn");
        newBoardBtn.addEventListener('click', function () {
           let newBoardTitle = document.querySelector('#newBoardTitle').value;
           let newBoardData = {

               'title': newBoardTitle
           };

           dataHandler.addNewBoard(newBoardData);
           location.reload();
        });
    },

    registerNewUser: function () {
        const registerBtn = document.querySelector("#registerNewUser");
        registerBtn.addEventListener("click", function () {
            let  username = document.querySelector("#newUsername").value;
            let email = document.querySelector("#newUserEmail").value;
            let password = document.querySelector("#newUserPassword").value;
            if (validateUser(email, password)) {
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
    checkUserStatus: function(){
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
        let base_container = document.querySelector('#base_container');
        let base_status = document.querySelector('#base_status');
        let base_card = document.querySelector('#base_card');

        for (let board of boards){
            let board_container = base_container.content.cloneNode(true);
            let board_name = board_container.querySelector('#base_board_name');
            let remove_board_btn = board_container.querySelector('#remove_board_btn');
            remove_board_btn.addEventListener('click', (event) => {
                event.preventDefault();
                this.listenNewRemoveBoard(board['id']);
            });

            let editBoardBtn = board_container.querySelector("#editBoardBtn");
            editBoardBtn.addEventListener('click', (event) => {
                event.preventDefault();
                this.listenEditBoardBtn(board);
            });

            let addStatusBtn = board_container.querySelector("#addStatusBtn");
            addStatusBtn.addEventListener('click', (event) => {
                event.preventDefault()
                this.addStatus(board["id"]);
            });


            board_name.innerHTML = board['title'];
            for (let status of statuses){
                if (status['board_id'] == board['id']){
                    let status_name = base_status.content.cloneNode(true);
                    status_name.querySelector('#status_name').innerHTML = status['title'];
                    // function listenDropStatus(status_name) {
                    //     status_name.addEventListener('drop', onDrop);
                    //     status_name.addEventListener('dragover', onDragOver);
                    //
                    // }


                    for (let card of cards){
                        if ((card['status_id']) == status['id'] && card['board_id'] == board['id']){
                            let card_element = base_card.content.cloneNode(true);
                            card_element.querySelector('#base_card_name').innerHTML = card['title'];
                            // let cardDataId = card_element.dataset.cardId;
                            // cardDataId = card["id"];
                            status_name.querySelector('#base_cards_space').appendChild(card_element);
                    //         let draggableElement = document.querySelector("#draggable_card");
                    //         card_element.setAttribute.draggable = "true";
                    //         function listenDropStatus(card_element) {
                    //             card_element.addEventListener('drop', onDragStart);
                    //
                    //
                    // }
                        }

                    }

                    board_container.querySelector('#base_statuses_space').appendChild(status_name);
                }
            }
            let addBtnList = board_container.querySelectorAll('#newCardBtn');
            let removeStatusBtnList = board_container.querySelectorAll("#removeStatusBtn");
            let renameStatusBtnList = board_container.querySelectorAll("#renameStatusBtn");
            let actualStatuses = saveDataById(board['id'], statuses);
            console.log(actualStatuses);
            for (let i = 0; i < actualStatuses.length; i++) {
                addBtnList[i].addEventListener('click', (event) => {
                    event.preventDefault();
                    functionAdd(board['id'], actualStatuses[i]['id']);
                });
                removeStatusBtnList[i].addEventListener('click', (event) => {
                    event.preventDefault();
                    let data = { "status_id": actualStatuses[i]["id"] };
                    dataHandler.removeStatus(data);
                });
                renameStatusBtnList[i].addEventListener('click', (event) =>{
                    event.preventDefault();
                    this.renameStatus(actualStatuses[i]);

                })

            }
            let removeCardBtnList = board_container.querySelectorAll('#removeCardBtn');
                if (removeCardBtnList === 0){
                    for (let index = 0; index < cards.length; index++) {
                        removeCardBtnList[index].addEventListener('click', (event) => {
                            event.preventDefault();
                            this.listenRemoveCard(cards[index]['id']);
                            location.reload();
                        });
                }

                    }
            let draggableElements = document.querySelectorAll("#draggable_card");
               for(let i = 0; i < draggableElements.length; i++) {
                   let cardDataId = draggableElements[i].dataset.cardId;
                   cardDataId = cards[i]["id"];
                   draggableElements[i].setAttribute.draggable = "true";
                   draggableElement[i].addEventListener('drag', onDragStart);
               }
            body_element.appendChild(board_container);

        }
    },
    listenDragCard: function (event, draggableElement) {

        draggableElement.addEventListener('drop', onDragStart);

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
    },
    addStatus: function (boardId) {
        const newStatusModal = document.querySelector("#newStatusModal");
        newStatusModal.style.visibility = "visible";
        newStatusModal.style.display = "block";

        let addStatusBtn = document.querySelector("#submitStatusBtn");
        addStatusBtn.addEventListener('click', (event) => {
            let statusTitle = document.querySelector("#newStatusTitle").value;
            let newStatusData = {
                "title": statusTitle,
                "board_id": boardId,
            }
            dataHandler.addStatus(newStatusData);
            newStatusModal.style.visibility = "hidden";
        });

    },
    renameStatus: function (status) {
        const renameStatusModal = document.querySelector("#renameStatusModal");
        renameStatusModal.style.visibility = "visible";
        renameStatusModal.style.display = "block";

        let currentTitleStatus = status["title"];
        let titleStatus = document.querySelector("#statusTitle");
        titleStatus.textContent = currentTitleStatus;

        let renameStatusBtn = document.querySelector("#submitRenameStatusBtn");

        renameStatusBtn.addEventListener('click', (event) => {
            let statusData = {
                "id": status["id"],
                "title": titleStatus.value
            }
            dataHandler.renameStatus(statusData);
            renameStatusModal.style.visibility = "hidden";
        });
    }
};


function validateUser (login, password) {
    let minLength = 5;
    let maxLength = 50;
    if ((login.length > minLength && login.length < maxLength) && (password.length > minLength && password.length < maxLength) && (login.indexOf("@"))) {
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


function onDragStart(event) {
  event
    .dataTransfer
    .setData('text/plain', event.target.id);
}

function onDragOver(event) {
  event.preventDefault();
}

function onDrop(event) {
  const id = event
    .dataTransfer
    .getData('text');
    const draggableElement = document.getElementById(id);
    const dropzone = event.target;
    dropzone.appendChild(draggableElement);
    event
        .dataTransfer
        .clearData();
}


