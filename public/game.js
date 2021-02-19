const socket = io();

// EVENTS

/*
 * Send a request to the server to create a new game
*/
function requestNewGame() {
    let textbox = document.getElementById('tbx_game_name');
    let name = textbox.value;

    if (name === "") {
        alert("La partie doit avoir un nom !");
        return;
    } else if (name.length > 300) {
        alert("Le nom de la partie ne peut pas dépasser 300 charactères !");
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/games', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 201) {
                textbox.value = "";
            } else {
                console.error(xhr.responseText);
            }
        }
    }
    xhr.send(JSON.stringify({ name: name }));
}

/*
 * Send a request to the server to get a list of all games, and display them
 */
function requestListOfGames() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/games', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                games = JSON.parse(this.responseText);
                for (let game of games) {
                    addNewGame(game);
                }
            } else {
                console.error(xhr.responseText);
            }
        }
    }
    xhr.send(null);
}

/*
 * Send a request to the server to delete a game
 */
function requestDeleteGame() {
    let tr = this.parentNode.parentNode;
    let game_id = tr.getAttribute("game_id");

    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", '/games/' + game_id, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(null);
}

/*
 * Send a request to the server to finish a game
 */
function requestFinishGame() {
    let tr = this.parentNode.parentNode;
    let game_id = tr.getAttribute("game_id");

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", '/games/' + game_id, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(null);
}

// FUNCTIONS

/*
 * Add a new game to the table
 */
function addNewGame(gameInfo) {
    let table = document.getElementById('tbl_games');

    var tr = document.createElement('tr');
    tr.setAttribute("game_id", gameInfo.game_id);

    var td1 = document.createElement('td');
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.checked = gameInfo.finish;
    checkbox.onchange = requestFinishGame;
    checkbox.classList.add("finish-game-checkbox");
    td1.appendChild(checkbox);

    var td2 = document.createElement('td');
    td2.innerText = gameInfo.game_name;
    if (gameInfo.finish) {
        td2.style.textDecoration = "line-through";
        td2.style.color = "grey";
    } else {
        addToGameCounter(1);
    }
    
    var td3 = document.createElement('td');
    var p = document.createElement('p');
    p.innerHTML = "&#x2716;";
    p.onclick = requestDeleteGame;
    p.classList.add("delete-game-button");
    td3.appendChild(p);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    table.insertAdjacentElement('afterbegin', tr);
}

/*
 * Delete a game from the table
 */
function deleteGame(gameInfo) {
    let table = document.getElementById('tbl_games');

    for (let tr of table.children) {
        if (tr.getAttribute("game_id") != gameInfo.game_id)
            continue;
        if (!tr.firstChild.firstChild.checked)
            addToGameCounter(-1);
        table.removeChild(tr);
        break;
    }
}

/*
 * Finish or relaunch a game from the table
 */
function finishGame(gameInfo) {
    let table = document.getElementById('tbl_games');

    for (let tr of table.children) {
        if (tr.getAttribute("game_id") != gameInfo.game_id)
            continue;
        let checkbox = tr.firstChild.firstChild;
        let td = tr.children[1];
        checkbox.checked = gameInfo.finish;
        if (gameInfo.finish) {
            td.style.textDecoration = "line-through";
            td.style.color = "grey";
            addToGameCounter(-1);
        } else {
            td.style.textDecoration = "";
            td.style.color = "black";
            addToGameCounter(1);
        }
        break;
    }
}

/*
 * Add the given variable to the game counter
 */
function addToGameCounter(toAdd) {
    let count = document.getElementById('txt_game_counter');
    count.innerText = String(parseInt(count.innerText) + toAdd);
}

// SOCKETS MANAGEMENT

/*
 * Socket event on new game
 */
socket.on('new game', function(data) {
    addNewGame(data);
});

/*
 * Socket event on game finished / relaunched
 */
socket.on('finish game', function(data) {
    finishGame(data);
});

/*
 * Socket event on game deleted
 */
socket.on('delete game', function(data) {
    deleteGame(data);
});