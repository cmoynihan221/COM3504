

function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

function checkMedia(){
    if (hasGetUserMedia()) {
        const constraints = {
            video: { width: { exact: 640 }, height: { exact: 480 }, audio: false },
        };
        const video = document.querySelector("video");

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream)=>gotStream(stream));

    } else {
        alert("getUserMedia() is not supported by your browser");
    }
}

function gotStream(stream){
    //navigator.mediaDevices.enumerateDevices().then(initAudioVideo);
    let mediaElement = document.querySelector('video');
    mediaElement.srcObject = stream;
}