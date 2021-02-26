import { dom } from "./dom.js";


// This function is to initialize the application
function init() {
    // init data
    dom.init();
    // loads the boards to the screen
    dom.loadBoards();
    // set user status
    dom.checkUserSatus();

}

function eventHandlers() {
    dom.listenNewUserBtn();
    dom.listenNewLoginBtn();
    dom.listenNewLogOutBtn();
}

init();
eventHandlers();

