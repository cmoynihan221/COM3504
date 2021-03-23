/**
 * @param identifier (how to find image offline, imagerURL+roomNo)
 * @param image (image)
 * @param canvas drawings
 */
class SpyChat{
    constructor (image, roomNo){
        this.room_url =roomNo+image;
        this.image = image;
        this.messages = new Array();
        this.link = null ;
        this.canvas = null;
    }
    addMessage(message){
        this.messages.push(message);
    }
    addCanvas(canvas){
        this.canvas = canvas;
    }
    updateCanvas(canvas){
        this.canvas = canvas;
    }
    addLink(link){
        this.link = link;
    }
    getID() {
        return this.room_url;
    }


}

/**
 * @param user (user who wrote message)
 * @param text (text of message)
 * @constructor
 */
class Message{
    constructor ( text){
        this.text = text;
    }
}





