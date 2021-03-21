
let localMediaStream= null;
let ctx = null;
let video = null;
let canvas = null;
let videoSelect;

function mediaOnLoad(){
    if(hasGetUserMedia()){
        navigator.mediaDevices
            .enumerateDevices()
            .then(sourceInfos =>  getSources(sourceInfos));
    }else {
        alert("This feature is not supported by your browser");
    }

}

function initMedia() {
    document.getElementById('start').style.display = 'none';
    document.getElementById('change').style.display = 'block';
    changeDisplay('prephoto', 'block');
    checkAndSetMedia();
}
function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

let localMediaStream= null;
let ctx = null;
let video = null;
let mediaCanvas = null;

function checkAndSetMedia(){

    videoSelect = document.getElementById('videoSource');
    if (hasGetUserMedia()) {

        const constraints = {
            video: { sourceId: videoSelect.value,
                facingMode: videoSelect.value,
                width: { exact: 300 },
                height: { exact: 150 },
                audio: false },
        };
        video = document.querySelector("video");
        mediaCanvas = document.querySelector('canvas');
        ctx = mediaCanvas.getContext('2d');

        video.addEventListener('click',snapshot,false);
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream)=>gotStream(stream),
            )
            .then((stream)=>gotStream(stream),)
            .catch(handleError);

    } else {
        alert("This feature is not supported by your browser");
    }
}
function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

function changeMedia(){
    checkAndSetMedia();
}

function gotStream(stream){
    //navigator.mediaDevices.enumerateDevices().then(initAudioVideo);
    let mediaElement = document.querySelector('video');
    mediaElement.srcObject = stream;
    localMediaStream = stream;
}

function snapshot(){
    video = document.querySelector("video");
    alert(video.videoHeight);
    if (localMediaStream){

        ctx.drawImage(video,0,0,video.videoWidth,video.videoHeight);
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
function sendphoto(){
    console.log(document.querySelector('img').src)
}
function retake(){
    changeDisplay('prephoto', 'block');
    changeDisplay('postphoto', 'none');
    changeDisplay('usephoto', 'none');
}
export function changeDisplay(className, style){
    let items = document.getElementsByClassName(className);
    for (let i =0;i < items.length;i++){
        items.item(i).style.display = style;
    }
}


function getSources(sourcesInfos){
    videoSelect = document.getElementById('videoSource');
    let cameraNames=[];
    let cameras = [];

    for (let i  = 0; i!=sourcesInfos.length; i++){
        let sourceInfo = sourcesInfos[i];

        if(sourceInfo.kind === 'videoinput'){

            let text = sourceInfo.label ||
                'camera' + (cameras.length + 1);

            cameraNames.push(text);
            cameras.push(sourceInfo.deviceId);
        }
    }
    if( /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        let option = document.createElement("option");
        option.text = "Back camera";
        option.value = 'environment'
        videoSelect.appendChild(option);
        let option2 = document.createElement("option");
        option2.text = "Front Camera";
        option2.orientation = 'user';
        videoSelect.appendChild(option2);

    }else{
        alert("not phone");
        for (let i = 0; i!==cameraNames.length;++i){
            const option = document.createElement("option");
            option.text = cameraNames[0];
            option.value = cameras[0];
            videoSelect.appendChild(option);
        }}

}


