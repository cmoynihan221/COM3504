let dataStruct;

/**
 * Initializes the find page
 */
function initFind(){
    document.getElementById('chat_interface').style.display = 'none';
    console.log(document.getElementById("image"));
}

/**
 * returns local store of chats
 * @returns {Promise<void>}
 */
async function findChats(){
    getCachedData('store_spychat')
        .then(past_chat => found(past_chat))
}

/**
 * adds chats to list for selection
 * @param data
 */
function found(data){
    let table = document.getElementById("results");
    changeDisplay("found", "block");
    console.log(data);
    for(let i=0;i<data.length;i++){
        let row = table.insertRow(-1);
        let cell1 = row.insertCell(0);
        let a = document.createElement('a');
        a.innerText = data[i].room_url;
        a.href = '#';
        a.onclick = function(){setTarget(data[i]);return false;}
        cell1.appendChild(a);
    }
}

/**
 * sets a chat to target
 * @param data
 */
function setTarget(data){
    dataStruct = new SpyChat(data);
    name = localStorage.getItem('name');
    document.getElementById('search').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
    document.getElementById('who_you_are').innerHTML= name;
    document.getElementById('in_room').innerHTML= ' ' +dataStruct.room_url+'    offline';

    let socket = null;
    if(dataStruct.canvas){
        initCanvas(socket, dataStruct.canvas, dataStruct, true, null, name);}
    else{
        initCanvas(socket, dataStruct.image, dataStruct, true, null, name);
    }
    dataStruct.messages.forEach(writeMessage);
    if(dataStruct.linked){
        document.getElementById("move_to_link").style.display = 'block';
    }
}

/**
 * moves to linked image offline
 */
function moveToLinkedOffline(){
    let a = dataStruct.room+dataStruct.linked;
    console.log(a);
    let canvas = $('#canvas');
    canvas =null;
    getData('store_spychat', dataStruct.room+dataStruct.linked, 'room_url')
        .then(data=> setTarget(data))
        .catch(e=> console.log(e));

}


/**
 * writes message to offline chat
 */
function textChatOffline() {
    let chatText = document.getElementById('chat_input').value
    let message = '<b>' + 'Me' + ':</b> ' + chatText
    writeMessage(message);
    dataStruct.addMessage(message)
}