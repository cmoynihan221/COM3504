/**
 * this file contains the functions to control the drawing on the canvas
 */
let room;
let userId;
let color = 'red', thickness = 4;

/**
 * it inits the image canvas to draw on. It sets up the events to respond to (click, mouse on, etc.)
 * it is also the place where the data should be sent  via socket.io
 * @param sckt the open socket to register events on
 * @param imageUrl the image url to download
 */
function initCanvas(sckt, imageUrl, data,offline) {
    if(!offline){
        socket = sckt;
        room = document.getElementById('roomNo').value;
        userId = localStorage.getItem('name');
    }


    let flag = false,
        prevX, prevY, currX, currY = 0;
    let canvas = $('#canvas');
    let cvx = document.getElementById('canvas');
    let img = document.getElementById('image');
    let ctx = cvx.getContext('2d');
    console.log("Canvas created:" + canvas);
    img.src = imageUrl;

    // event on the canvas when the mouse is on it
    canvas.on('mousemove mousedown mouseup mouseout', function (e) {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.position().left;
        currY = e.clientY - canvas.position().top;
        if (e.type === 'mousedown') {
            flag = true;
        }
        if (e.type === 'mouseup' || e.type === 'mouseout') {
            if(flag == true){
                data.updateCanvas(cvx.toDataURL());
            }
            flag = false;
        }
        // if the flag is up, the movement of the mouse draws on the canvas
        if (e.type === 'mousemove') {
            if (flag) {
                drawOnCanvas(ctx, canvas.width, canvas.height, prevX, prevY, currX, currY, color, thickness);
                if(!offline){
                socket.emit('draw', room, userId, canvas.width, canvas.height, prevX, prevY, currX, currY, color, thickness);}
            }
        }

    });


    // this is code left in case you need to  provide a button clearing the canvas (it is suggested that you implement it)
    $('.canvas-clear').on('click', function (e) {
        if(!offline){
            socket.emit('clear canvas', room, userId);}
        else{
            img.style.display = 'block';
            reDrawCanvas(img, ctx, cvx, canvas);
            data.updateCanvas(cvx.toDataURL());
        }
    });

    // called when an annotation is received
    if(!offline){
    socket.on('draw', function (room, userId, canvasWidth, canvasHeight, x1, y1, x2, y2, color, thickness) {
        let ctx = canvas[0].getContext('2d');
        drawOnCanvas(ctx, canvasWidth, canvasHeight, x1, y1, x2, y2, color, thickness,);
    });}
    if(!offline){
    socket.on('clear canvas', function (room, userId) {
        img.style.display = 'block';
        reDrawCanvas(img, ctx, cvx, canvas);
        data.updateCanvas(cvx.toDataURL());
        writeOnHistory('<b>' + userId + '</b> cleared the canvas. ');
    });}

    console.log("started")
    // this is called when the src of the image is loaded
    // this is an async operation as it may take time
    img.addEventListener('load', () => {
        console.log("img loaded");
        // it takes time before the image size is computed and made available
        // here we wait until the height is set, then we resize the canvas based on the size of the image
        let poll = setInterval(function () {
            if (img.naturalHeight) {
                clearInterval(poll);
                reDrawCanvas(img, ctx, cvx, canvas);

                data.updateCanvas(cvx.toDataURL());
            }
        }, 10);
    });
}

function reDrawCanvas(img, ctx, cvx, canvas){
    // resize the canvas
    let ratioX=1;
    let ratioY=1;
    // if the screen is smaller than the img size we have to reduce the image to fit
    if (img.clientWidth>window.innerWidth)
        ratioX=window.innerWidth/(img.clientWidth);
    if (img.clientHeight> window.innerHeight)
        ratioY= img.clientHeight/(window.innerHeight);
    let ratio= Math.min(ratioX, ratioY);
    // resize the canvas to fit the screen and the image
    cvx.width = canvas.width = img.clientWidth*ratio;
    cvx.height = canvas.height = img.clientHeight*ratio;
    // draw the image onto the canvas
    drawImageScaled(img, cvx, ctx);
    // hide the image element as it is not needed
    img.style.display = 'none';


}
/**
 * called when it is required to draw the image on the canvas. We have resized the canvas to the same image size
 * so it is simpler to draw later
 * @param img
 * @param canvas
 * @param ctx
 */


function drawImageScaled(img, canvas, ctx) {
    // get the scale
    let scale = Math.min(canvas.width / img.width, canvas.height / img.height);
    // get the top left position of the image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let x = (canvas.width / 2) - (img.width / 2) * scale;
    let y = (canvas.height / 2) - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}


/**
 * this is called when we want to display what we (or any other connected via socket.io) draws on the canvas
 * note that as the remote provider can have a different canvas size (e.g. their browser window is larger)
 * we have to know what their canvas size is so to map the coordinates
 * @param ctx the canvas context
 * @param canvasWidth the originating canvas width
 * @param canvasHeight the originating canvas height
 * @param prevX the starting X coordinate
 * @param prevY the starting Y coordinate
 * @param currX the ending X coordinate
 * @param currY the ending Y coordinate
 * @param color of the line
 * @param thickness of the line
 */
function drawOnCanvas(ctx, canvasWidth, canvasHeight, prevX, prevY, currX, currY, color, thickness) {
    //get the ration between the current canvas and the one it has been used to draw on the other comuter
    let ratioX= canvas.width/canvasWidth;
    let ratioY= canvas.height/canvasHeight;
    // update the value of the points to draw
    prevX*=ratioX;
    prevY*=ratioY;
    currX*=ratioX;
    currY*=ratioY;
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.stroke();
    ctx.closePath();

}
