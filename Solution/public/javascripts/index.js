
let name;
let roomNo = null;
let socket = io.connect();
let parent;
let imageSelected;

/**
 * creates custom error
 * @param message
 * @constructor
 */
function CustomError(message) {
    this.message = message;
    this.name = 'Custom Error';
}

/**
 * changes display of a class
 * @param className
 * @param style
 */
function changeDisplay(className, style){
    let items = document.getElementsByClassName(className);
    for (let i =0;i < items.length;i++){
        items.item(i).style.display = style;
    }
}
/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
    // it sets up the interface so that userId and room are selected

    //document.getElementById('chat-section').load('chatSection.ejs');

    initSocket();
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';
    if('indexedDB' in window){
        initDatabase()
            .catch(e => {
                console.log('Database init error')
            })
    }else{
        console.log('Browser does not support IndexedDB');
    }
}

/**
 * checks connection and loads correct screen
 */
function checkConnection(){

    if (localStorage.getItem('name') == null || localStorage.getItem('name') == "null") {
        document.getElementById('splash_screen').style.display = 'none';
        document.getElementById('login').style.display = 'block';
    } else {
        document.getElementById('logoutLabel').textContent = "Logged in as " + localStorage.getItem('name');
        document.getElementById('splash_screen').style.display = 'block';
        document.getElementById('login').style.display = 'none';
    }


   /* if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function() { console.log('Service Worker Registered'); });
    }*/

    changeDisplay("offline", "none")
    //window.addEventListener("load", () => {
        //hasNetwork(navigator.onLine);
        window.addEventListener("online", () => {
            // Set hasNetwork to online when they change to online.
            //hasNetwork(true);
            changeDisplay("online", "block")
            changeDisplay("offline", "none")
            saveImagesInLocal();
        });
        window.addEventListener("offline", () => {
            // Set hasNetwork to offline when they change to offline.
            //hasNetwork(false);
            changeDisplay("online", "none")
            changeDisplay("offline", "block")
        });
    //});
}

/**
 * called to generate a random room number
 * This is a simplification. A real world implementation would ask the server to generate a unique room number
 * so to make sure that the room number is not accidentally repeated across uses
 */
function generateRoom() {
    roomNo = Math.round(Math.random() * 10000);
    document.getElementById('roomNo').value = 'R' + roomNo;
}

/**
 * Loads an image if it has been selected from the uploaded images
 * @param image - path to the image selected in the uploaded images page
 */
function loadImage(image){
    //checks if an image has been loaded and changes display based on it
    if (image){
        document.getElementById('selecting_image').style.display="none"
        document.getElementById('already_selected').style.display="block"
        imageSelected =image
    }
}

/**
 * Initialises socket
 */
function initSocket() {
    // called when someone joins the room. If it is someone else it notifies the joining of the room
    socket.on('joined', function (room, userId) {
        if (userId === name) {
            // it enters the chat
            hideLoginInterface(room, userId);
        } else {
            // notifies that someone has joined the room
            writeOnHistory('<b>' + userId + '</b>' + ' joined room ' + room);
        }
    });
    // called when a message is received
    socket.on('chat', function (room, userId, chatText) {
        if (room == roomNo) {
            let who = userId
            if (userId === name) who = 'Me';
            writeOnHistory('<b>' + who + ':</b> ' + chatText);
        }
    });
}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value
    socket.emit('chat', roomNo, name, chatText);
}

/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
let data = null;


function logoutOfSplashScreen() {
    localStorage.setItem('name', null);
    document.getElementById('name').value = "";

    document.getElementById('login').style.display = 'block';
    document.getElementById('splash_screen').style.display = 'none';
}

/**
 * sets up login data
 */
function loginToSplashScreen() {
    name = document.getElementById('name').value;
    if (!name) name = 'Unknown-' + Math.random();
    localStorage.setItem('name', name);
    document.getElementById('logoutLabel').textContent = "Logged in as " + name;

    document.getElementById('login').style.display = 'none';
    document.getElementById('splash_screen').style.display = 'block';
}

/**
 * User can connect to a room when the required fields are filled in
 */
function connectToRoom() {
    roomNo = document.getElementById('roomNo').value;
    localStorage.setItem('linkedRoom', null);
    name = localStorage.getItem('name');
    let imageUrl;

    if(document.getElementById('image_url').files[0] == undefined && !imageSelected) {

        alert("Must choose a file");
    }else{
    if (imageSelected){
        imageUrl = imageSelected
    }else{

        let filename =document.getElementById('image_url') .files[0].name;
        imageUrl = '/images/'+filename;
    }
    console.log("imageURL"+imageUrl)
    socket.emit('create or join', roomNo, name);
    data = new SpyChat(imageUrl,roomNo);
    initCanvas(socket, imageUrl, data, false, roomNo, name);
    data.storeData();
    hideLoginInterface(roomNo, name);}
}

/**
 * Enables a user to move to a linked image

 */
function moveToLinked() {
    if (localStorage.getItem('linkedRoom') == null || localStorage.getItem('linkedRoom') == "null") {
        localStorage.setItem('linkedRoom', 'R' + Math.round(Math.random() * 10000));
    }
    roomNo = localStorage.getItem('linkedRoom');
    socket.emit('create or join', localStorage.getItem('linkedRoom'), name);
    let imageUrl = data.linked;
    initCanvas(socket, imageUrl, data, false, roomNo, name);
    document.getElementById('linkadd').style.display="block";
    document.getElementById('move_to_link').style.display="none";
}

/**
 * Moves to linked image
 */
function linkedChat(){
    if(document.getElementById('new_image_url').files[0] == undefined) {
        alert("Must choose a file");
    }else{

    let filename =document.getElementById('new_image_url').files[0].name;
    let imageUrl = '/images/'+filename;
    try{
        createNewData(imageUrl);
        document.getElementById('linkadd').style.display="none";
        document.getElementById('move_to_link').style.display="block";
        socket.emit('chat', roomNo, name, "Added linked photo.");
    }catch (e) {
        alert("Cannot use the same file twice!")
    }
    }

}

/**
 * Creates a new data store
 * @param imgUrl  - image url to store
 */
function createNewData(imgUrl){
    let newData = new SpyChat(imgUrl,roomNo);
    if(newData.room_url == data.room_url){
        throw new CustomError('Duplicate File Error');
    }
    data.addLink(imgUrl)
    parent = data;
    newData.storeData();
    document.getElementById('new_image_url').value = null;
}

/**
 * Writes message on chat
 * @param text
 */
function writeMessage(text){
    if (text==='') return;
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    // scroll to the last element
    history.scrollTop = history.scrollHeight;
    document.getElementById('chat_input').value = '';
}

/**
 * it appends the given html text to the history div
 * this is to be called when the socket receives the chat message (socket.on ('message'...)
 * @param text: the text to append
 */
function writeOnHistory(text) {
    writeMessage(text);
    data.addMessage(text);
}

/**
 * it hides the initial form and shows the chat
 * @param room the selected room
 * @param userId the user name
 */
function hideLoginInterface(room, userId) {
    document.getElementById('initial_form').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
    document.getElementById('who_you_are').innerHTML= userId;
    document.getElementById('in_room').innerHTML= ' '+room;
}





