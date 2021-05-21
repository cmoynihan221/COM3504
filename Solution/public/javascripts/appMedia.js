
let localMediaStream= null;
let ctx = null;
let video = null;

let videoSelect;
let mediaCanvas = null;

/**
 * page load function, gets media devices
 */
function mediaOnLoad(){
    //window.addEventListener("online", () => {
     //   saveImagesInLocal();
    //});

    if(hasGetUserMedia()){
        navigator.mediaDevices
            .enumerateDevices()
            .then(sourceInfos =>  getSources(sourceInfos));
    }else {
        alert("This feature is not supported by your browser");
    }


}

/**
 * initialises the media stream
 */
function initMedia() {
    document.getElementById('start').style.display = 'none';
    document.getElementById('change').style.display = 'block';
    changeDisplay('prephoto', 'block');

    checkAndSetMedia();
}

/**
 * Checks the media stream
 * @returns {boolean}
 */
function hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}


/**
 * Sets up the webRTC media stream and canvas
 */
function checkAndSetMedia(){
    console.log("check and set media") ;
    videoSelect = document.getElementById('videoSource');
    if (hasGetUserMedia()) {
        const constraints = {
            video: { sourceId: videoSelect.value,
                facingMode: videoSelect.value,
               width: { exact: 600 },
                height: { exact: 300 },
                audio: false },
        };
        video = document.querySelector("video");
        mediaCanvas = document.querySelector('canvas');
        mediaCanvas.height = video.videoHeight
        mediaCanvas.width = video.videoWidth
        ctx = mediaCanvas.getContext('2d');

        video.addEventListener('click',snapshot,false);
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream)=>gotStream(stream))
            .catch(error => handleError(error))
    } else {
        alert("This feature is not supported by your browser");
    }
}

/**
 * Error handle function
 * @param error
 */
function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

/**
 * Function to change media
 */
function changeMedia(){
    checkAndSetMedia();
}

/**
 * sets up the media stream
 * @param stream    the media stream
 */
function gotStream(stream){
    let mediaElement = document.querySelector('video');
    mediaElement.srcObject = stream;
    localMediaStream = stream;
}

/**
 * Takes a screenshot of the RTC media
 */
function snapshot(){
    video = document.querySelector("video");
    //video = document.get
    if (localMediaStream){
        mediaCanvas.height = video.videoHeight
        mediaCanvas.width = video.videoWidth
        //TODO set capture are to correct size
        ctx.drawImage(video,0,0)
        document.querySelector('img').src
        = mediaCanvas.toDataURL('image/png');
        changeDisplay('prephoto', 'none');
        changeDisplay('postphoto', 'block');
        changeDisplay('usephoto', 'none');
    }

}
/**
 * Calls save image function
 */
function save(){
    let name = localStorage.getItem('name');
    let image = new localImage(name,mediaCanvas.toDataURL());

    image.storeData();
    //change first parameter to userID once users db is made

    saveImage(name, mediaCanvas.toDataURL());


    alert("Photo Saved!");
}

function saveImagesInLocal(){
    try{
        getCachedData('upload_store')
            .then(data => data.forEach(image=>getImage(image)))
            .catch(e=> console.log(e));

        wipeData('upload_store')
            .then()
            .catch(e=>console.log(e));

    }
    catch(e){
        console.log(e);
    }
}
window.saveImagesInLocal = saveImagesInLocal;
function getImage(image){
    let image_data = getData('image_store',image )
    saveImage(image_data.user,image_data.image)
}
/**
 * Function to send image to sever storage
 * @param userID    Id of the current user
 * @param imageBlob     Blob of the image to be saved
 */
function saveImage(userID, imageBlob){
    let data = {userId: userID, imageBlob: imageBlob};

    $.ajax({
        dataType: "json",
        url: '/save_image',
        type: "POST",
        data: data,
        success: function (data) {
            token = data.token;
            // go to next picture taking
            location.reload();
            console.log("SAVED IMAGE!!");
        },
        error: function (err) {
            storeDataInCache(userID+imageBlob,'upload_store')
                .then(t=>console.log("Successfully stored in upload"))
                .catch(e=>console.log("Error saving data:"+e.message))
        }
    });



}

/**
 * Hide and shows relevant obects
 */
function retake(){
    changeDisplay('prephoto', 'block');
    changeDisplay('postphoto', 'none');
}

/**
 * Changes the display value for a class of objects
 * @param className the class of the object to change
 * @param style value to change style to
 */
function changeDisplay(className, style){
    let items = document.getElementsByClassName(className);
    for (let i =0;i < items.length;i++){
        items.item(i).style.display = style;
    }
}

/**
 * Evaluates media source information from device and adds relevant information to drop down boxes
 * @param sourcesInfos camera sources object
 */
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
    // Sets front/back camera for phones/tablets
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
        for (let i = 0; i!==cameraNames.length;++i){
            const option = document.createElement("option");
            option.text = cameraNames[0];
            option.value = cameras[0];
            videoSelect.appendChild(option);
        }}

}


