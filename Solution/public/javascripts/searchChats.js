
function initFind(){
    document.getElementById('chat_interface').style.display = 'none';
    console.log(document.getElementById("image"));
}
async function findChats(){
    getCachedData()
        .then(past_chat => found(past_chat))
}

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
        a.onclick = function(){setTarget(data, i);return false;}
        cell1.appendChild(a);
    }


}
function setTarget(data,i){
    document.getElementById('search').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
    document.getElementById('who_you_are').innerHTML= 'user';
    document.getElementById('in_room').innerHTML= ' '+'local';
    console.log("click");
    let dataStruc = new SpyChat(data[i].canvas,'offline' );
    //let imageUrl= document.getElementById('image_url').value;
    let imageUrl = data[i].canvas;
    console.log(imageUrl);
    let socket = null;
    initCanvas(socket, imageUrl, dataStruc, true);

}