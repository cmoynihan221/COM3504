


function initMedia() {
    document.getElementById('start').style.display = 'none';
    changeDisplay('prephoto', 'block');
    checkMedia();
}
function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

let localMediaStream= null;
let ctx = null;
let video = null;
let mediaCanvas = null;

function checkMedia(){
    if (hasGetUserMedia()) {
        const constraints = {
            video: { width: { exact: 300 }, height: { exact: 150 }, audio: false },
        };
        video = document.querySelector("video");
        mediaCanvas = document.querySelector('canvas');
        ctx = mediaCanvas.getContext('2d');

        video.addEventListener('click',snapshot,false);
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream)=>gotStream(stream),

            );

    } else {
        alert("This feature is not supported by your browser");
    }
}



function gotStream(stream){
    //navigator.mediaDevices.enumerateDevices().then(initAudioVideo);
    let mediaElement = document.querySelector('video');
    mediaElement.srcObject = stream;
    localMediaStream = stream;
}

function snapshot(){
    if (localMediaStream){

        ctx.drawImage(video,0,0);
        document.querySelector('img').src
        = mediaCanvas.toDataURL('image/png');
        changeDisplay('prephoto', 'none');
        changeDisplay('postphoto', 'block');
        changeDisplay('usephoto', 'none');
    }
}
function save(){
    changeDisplay('usephoto', 'block');
    alert("Photo Saved!");
}

function retake(){
    changeDisplay('prephoto', 'block');
    changeDisplay('postphoto', 'none');
    changeDisplay('usephoto', 'none');
}
function changeDisplay(className, style){
    let items = document.getElementsByClassName(className);
    for (let i =0;i < items.length;i++){
        items.item(i).style.display = style;
    }
}

