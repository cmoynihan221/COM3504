
async function findChats(){
    let room_url = document.getElementById('input').value;
    getCachedData(room_url)
        .then(past_chat => found(past_chat))

}

function found(data){
    changeDisplay("found", "block");
    let img = document.querySelector('img');
    console.log(data);
    img.src = data.canvas;
}