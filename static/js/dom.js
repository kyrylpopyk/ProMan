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
                    setLogBtn(false);
                    removeBoard();
                    informationPopup('User log out successful');
                })
            console.log("clicked");
        });
    },
    listenNewBoardBtn: function() {
        document.querySelector("#newBoardBtn").onclick = function () {
            if (actual_Cookies()['id']){
                createAskModal('ask-about-board-add');
                const modal = document.querySelector('#modal-space').querySelector('#ask-about-board-add');
                const close = modal.querySelector('.close-btn');
                close.onclick = function (){
                    closeAskModal('ask-about-board-add');
                }
                const newBoardModal = document.querySelector('#newBoard');
                newBoardModal.style.visibility = "visible";
                newBoardModal.style.display = 'block';
                dom.addNewBoard();
            }
            else {
                informationPopup('Login or registrate account first :)');
            }
        };
    },

    listenEditBoardBtn: function(board) {
        createAskModal('ask-about-board-rename');
        const editBoardModal = document.querySelector('#editBoard');
        const submitEditedBoardBtn = editBoardModal.querySelector('#submitEditedBoardBtn')
        let boardTitleToEdit = editBoardModal.querySelector('#editedTitle');
        boardTitleToEdit.textContent = getCurrentBoardTitle(board['id']);
        let boardId = board['id'];
        editBoardModal.style.visibility = "visible";
        editBoardModal.style.display = 'block';
        submitEditedBoardBtn.addEventListener('click', (event) => {
            event.preventDefault();

            let editedBoardData = {

                'id': boardId,
                'title': boardTitleToEdit.value
            };
            dataHandler.editBoard(editedBoardData, renameBoardHTML);
            closeAskModal('ask-about-board-rename');
        });
    },

    addNewBoard: function () {
        const newBoardBtn = document.querySelector(".addBoardBtn");
        newBoardBtn.onclick = function () {
           let newBoardTitle = document.querySelector('#newBoardTitle').value;
           let newBoardData = {

               'title': newBoardTitle
           };
           dataHandler.addNewBoard(newBoardData, appendBoardToHTML);
           closeAskModal('ask-about-board-add');
        };
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
        return fetch(`${window.location.origin}/checkLogin`,{
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
                return data
            });
    },
    showBoard: function (boards, statuses, cards) {

        let body_element = document.querySelector('#body');
        for (let board of boards){
            body_element.appendChild(createNewBoard(board, statuses, cards));
        }
    },
    listenRemoveCard: function(cardId, callback) {
        dataHandler.removeCard(cardId, callback);
    },
    addNewCardModal: function (boardId, statusId) {
        createAskModal('ask-about-card-add')
        const newCardModal = document.querySelector('#newCardModal');
        newCardModal.style.visibility = "visible";
        newCardModal.style.display = 'block';
        dom.addNewCard(boardId, statusId);

    },
    addNewCard: function (boardId, statusId){
        const submitCardBtn = document.querySelector("#submitCardBtn");
        submitCardBtn.onclick = function () {
           let newCardTitle = document.querySelector('#newCardTitle').value;
           let newCardData = {
               'title': newCardTitle,
               'board_id': boardId,
               'status_id': statusId
           };
           dataHandler.addNewCard(newCardData, addCardToHTML);
           closeAskModal('ask-about-card-add');
        };
    },
    listenNewRemoveBoard: function (board_id){
        dataHandler.removeBoard(board_id, removeBoardFromHTML);
    },
    addStatusModal: function (boardId) {
        createAskModal('ask-about-status-add');
        const newStatusModal = document.querySelector("#newStatusModal");
        newStatusModal.style.visibility = "visible";
        newStatusModal.style.display = "block";
        this.addStatus(boardId);
    },
    addStatus: function(boardId){
        let addStatusBtn = document.querySelector("#submitStatusBtn");
        addStatusBtn.onclick = function(){
            let statusTitle = document.querySelector("#newStatusTitle").value;
            let newStatusData = {
                "title": statusTitle,
                "board_id": boardId,
            }
            const newStatusModal = document.querySelector("#newStatusModal");
            dataHandler.addStatus(newStatusData, addStatusToHTML);
            closeAskModal('ask-about-status-add');
        };
    },
    renameStatus: function (status) {
        createAskModal('ask-about-status-rename');
        const renameStatusModal = document.querySelector("#renameStatusModal");
        renameStatusModal.style.visibility = "visible";
        renameStatusModal.style.display = "block";

        let currentTitleStatus = getCurrentStatusTitle(status['id']);
        let titleStatus = document.querySelector("#statusTitle");
        titleStatus.textContent = currentTitleStatus;

        let renameStatusBtn = document.querySelector("#submitRenameStatusBtn");

        renameStatusBtn.addEventListener('click', (event) => {
            let statusData = {
                "id": status["id"],
                "title": titleStatus.value
            }
            dataHandler.renameStatus(statusData, renameStatus);
            closeAskModal('ask-about-status-rename');
        });
    },
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
    const base_inf_pop_up = document.querySelector('#information-popup');
    const inf_pop_up = base_inf_pop_up.content.cloneNode(true);
    let inf_pop_title = inf_pop_up.querySelector('.information-popup-title')
    inf_pop_title.innerHTML = information;

    const modalSpace = document.querySelector('#modal-space');
    modalSpace.appendChild(inf_pop_up);
    window.$('.information-popup').modal('show');
    setTimeout( () =>{
        window.$('.information-popup').modal('hide')
        const modalSpace = document.querySelector('#modal-space');
        modalSpace.querySelector('#information-popup').remove();
    }, 1000)
}

// function createAskModal(templateId){
//     const baseAskModal = document.querySelector(`#${templateId}`);
//     const askModal = baseAskModal.content.cloneNode(true);
//     const modalSpace = document.querySelector('#modal-space');
//     modalSpace.appendChild(askModal);
// }
//
// function closeAskModal(templateId){
//     const modalSpace = document.querySelector('#modal-space');
//     modalSpace.querySelector(`#${templateId}`).remove();
// }

function saveDataById(board_id, data){
    let new_data = [];
    for (let i = 0; i < data.length; i++){
        if (data[i]['board_id'] == board_id){
            new_data.push(data[i]);
        }
    }
    return new_data;
}

function functionAddCard(board_id, status_id) {
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


function createNewBoard(boardData, statusesData, cardsData){
    let base_container = document.querySelector('#base_container');
    let board_container = base_container.content.cloneNode(true);

    let editBoardBtn = board_container.querySelector("#editBoardBtn");
    editBoardBtn.addEventListener('click', (event) => {
        event.preventDefault();
        dom.listenEditBoardBtn(boardData);
    });

    let addStatusBtn = board_container.querySelector("#addStatusBtn");
    addStatusBtn.addEventListener('click', function(){
        dom.addStatusModal(boardData['id']);
    });

    let remove_board_btn = board_container.querySelector('#remove_board_btn');
    remove_board_btn.addEventListener('click', () => {
        dom.listenNewRemoveBoard(boardData['id']);
    });

    board_container.firstElementChild.id = boardData['id'];
    board_container.querySelector('#base_board_name').innerHTML = boardData['title'];

    if (statusesData !== null){
        for (let status of statusesData){
            if (status['board_id'] == boardData['id']) {
                board_container.querySelector('#base_statuses_space').appendChild(createNewStatus(status, cardsData, boardData['id']));
            }
        }
    }

    return board_container
}

function createNewStatus(statusData, cardsData=null, boardId = null){
    let base_status_name = document.querySelector('#base_status');
    let status_name = base_status_name.content.cloneNode(true);
    status_name.querySelector('#status_name').innerHTML = statusData['title'];
    status_name.firstElementChild.id = statusData['id'];

    if (cardsData != null){
        for (let card of cardsData){
            if (card['status_id'] == statusData['id']){
                status_name.querySelector('#base_cards_space').appendChild(createNewCard(card));
            }
        }
    }

    let removeStatusBtnList = status_name.querySelector("#removeStatusBtn");
    let renameStatusBtnList = status_name.querySelector("#renameStatusBtn");
    let dropzone = status_name.querySelector('#base_cards_space');

    removeStatusBtnList.addEventListener('click', (event) => {
        event.preventDefault();
        let data = { "status_id": statusData["id"] };
        dataHandler.removeStatus(data, removeStatusFromHTML);
    });

    renameStatusBtnList.addEventListener('click', (event) =>{
        event.preventDefault();
        dom.renameStatus(statusData);
    });
    dropzone.addEventListener('dragover', onDragOver);
    dropzone.addEventListener('drop',onDrop);

    let addBtnList = status_name.querySelector('#newCardBtn');
    addBtnList.onclick = function(){
        dom.addNewCardModal(boardId, statusData['id']);
    };

    return status_name;
}

function createNewCard(cardData=null){
    let base_card = document.querySelector('#base_card');
    let card_element = base_card.content.cloneNode(true);
    card_element.querySelector('#base_card_name').innerHTML = cardData['title'];

    let removeCardBtnList = card_element.querySelector('#removeCardBtn');
    removeCardBtnList.addEventListener('click', (event) => {
        event.preventDefault();
        dom.listenRemoveCard(cardData['id'], removeCardFromHtml);
    });
    card_element.firstElementChild.id = cardData['id'];

    let draggableElement = document.querySelector("#draggable_card");
    if (draggableElement != null){
        let cardDataId = draggableElement.dataset.cardId;
        cardDataId = cardData["id"];
        // draggableElements.setAttribute.draggable = "true";
        draggableElement.addEventListener('ondrag', onDragStart);
    }

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

function renameBoardHTML(response){
    const boardsHTML = document.querySelector('#body').querySelectorAll('.content-board-list')
    const newBoardName = response['title'];
    const boardId = response['id'];
    for (let board of boardsHTML){
        if (board.id == boardId){
            board.querySelector('#base_board_name').innerHTML = newBoardName;
        }
    }
}

function addStatusToHTML(response){
    const boardId = response['board_id'];
    const statusData = response['status_data'];
    const boardsHTML = document.querySelector('#body').querySelectorAll('.content-board-list');
    for (let board of boardsHTML){
        if (board.id == boardId){
            board.querySelector('#base_statuses_space').appendChild(createNewStatus(statusData,null, boardId));
        }
    }
}

function removeStatusFromHTML(response){
    const statusesHTML = document.querySelectorAll('.column-status-grid');
    const statusId = response['id'];
    for (let status of statusesHTML){
        if (status.id == statusId){
            status.remove();
        }
    }
}

function renameStatus(response){
    const statusId = response['id'];
    const newStatusTitle = response['title'];
    const allStatuses = document.querySelectorAll('.column-status-grid');
    for (let status of allStatuses){
        if (status.id == statusId){
            status.querySelector('#status_name').innerHTML = newStatusTitle;
        }
    }
}

function addCardToHTML(response){
    const cardData = response;
    const statusId = response['status_id'];
    const allStatuses = document.querySelectorAll('.column-status-grid');
    for (let status of allStatuses){
        if (status.id == statusId){
            status.querySelector('#base_cards_space').appendChild(createNewCard(cardData));
        }
    }
}

function removeCardFromHtml(response){
    const cardId = response;
    const cardsHTML = document.querySelectorAll('.row-card-grid');
    for (let card of cardsHTML){
        if (card.id == cardId){
            card.remove();
        }
    }
}

function createAskModal(templateId){
    const baseAskModal = document.querySelector(`#${templateId}`);
    const askModal = baseAskModal.content.cloneNode(true);
    const modalSpace = document.querySelector('#modal-space');
    modalSpace.appendChild(askModal);
}

function closeAskModal(templateId){
    const modalSpace = document.querySelector('#modal-space');
    modalSpace.querySelector(`#${templateId}`).remove();
}

function getCurrentStatusTitle(statusId){
    const statusesHtml = document.querySelectorAll('.column-status-grid');
    for (let status of statusesHtml){
        if (status.id == statusId){
            return status.querySelector('#status_name').innerHTML;
        }
    }
}

function getCurrentBoardTitle(boardId){
    const boardsHtml = document.querySelectorAll('.content-board-list');
    for (let board of boardsHtml){
        if (board.id == boardId){
            return board.querySelector('#base_board_name').innerHTML;
        }
    }
}

function removeBoard(){
    let boards = document.querySelectorAll('.content-board-list');
    for (let board of boards){
        board.remove();
    }
}

function actual_Cookies(){
    let cookies = {

    }
    for (let cookie of document.cookie.split('; ')){
        cookies[cookie.split('=')[0]] = cookie.split('=')[1];
    }
    return cookies;
}




