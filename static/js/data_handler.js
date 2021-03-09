// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
import { dom } from "./dom.js";

export let dataHandler = {
    _data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())  // parse the response as JSON
        .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function

        fetch(url, {
            method: 'POST',
            headers: new Headers({
                        'content-type': 'application/json'
                    }),
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
            .then((response) => {
                return response.json()
            })
            .then( response => {
                console.log(response);
            })
            // .catch(error => callback(error));
    },
    init: function () {
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
        let data = this._api_post("/get-board", boardId, callback);
        return data;
    },
    registerUser: function (formData) {
        this._api_post(`${window.location.origin}/register`, formData, (response) => {
            alert(response);
        });
    },

    addNewBoard: function(boardData) {
        console.log(boardData);
        return this._api_post(`${window.location.origin}/new_board`, boardData);
    },


    addNewCard: function(cardData) {
        console.log(cardData);
        return this._api_post(`${window.location.origin}/new_card`, cardData);
    },

    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
        return this._api_get("/get-statuses", callback);
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: function (boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
        return this._api_post("/get-cards", boardId);
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },


    getLogins: function () {
       return this._api_get('/get-logins');

    },

    makeBoards: function (){
        fetch(`${window.location.origin}/get-boards`, {
        method: 'POST',
        headers: new Headers({
            'content-type': 'application/json'
        }),
        credentials: 'same-origin'
    })
        .then((response) => {
            return response.json()
        })
        .then((response) => {
            let board_data = response;
            dom.showBoard(board_data['boardData'], board_data['statusesData'], board_data['cardsData']);
        })
    }

    // here comes more features
};
