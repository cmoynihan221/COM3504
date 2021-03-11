/**
 * @param identifier (how to find image offline)
 * @param url (url of image)
 * @param image (image + drawings)
 * @param messages (array of messages)
 * @param link (link to next image)
 */
class SpyChat{
    constructor (identifier, url, image, messages, link){
        this.identifier = identifier;
        this.url = url;
        this.image = image;
        this.messages = messages;
        this.link = link;
    }
    addMessage(message){
        this.messages.push(message);
    }
}

/**
 * @param user (user who wrote message)
 * @param text (text of message)
 * @constructor
 */
class Message{
    constructor (user, text){
        this.user = user;
        this.text = text;
    }
}

/**
 * Creates spy chat data structure for local storage
 * @param identifier
 * @param url
 * @param image
 * @param link
 * @returns {SpyChat}
 */
function newSpyChat(identifier, url, image, link){
    let messages = [];
    return new SpyChat(
        identifier,
        url,
        image,
        messages,
        link);
}

/**
 * Adds a message and the user who typed it to a spychat
 * @param spyChat
 * @param user
 * @param message
 */
function addMessage(spyChat, user, message){
    spyChat.addMessage(new Message(
        user,
        message));
}