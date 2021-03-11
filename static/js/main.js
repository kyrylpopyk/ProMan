import { dom } from "./dom.js";
import {dataHandler} from "./data_handler.js";


// This function is to initialize the application
function init() {
    // init data
    dom.init();
    // loads the boards to the screen
    // set user status
    dom.checkUserStatus();

}

function eventHandlers() {
    dom.listenNewUserBtn();
    dom.listenNewLoginBtn();
    dom.listenNewLogOutBtn();
    dom.listenNewBoardBtn();


}

init();
eventHandlers();

