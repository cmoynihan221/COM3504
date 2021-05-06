import * as idb from './idb/index.js';
let db;

/*
* @param identifier (how to find image offline, imagerURL+roomNo)
* @param image (image)
* @param canvas drawings
*/
class SpyChat{
    constructor (inputData, roomNo){
        if(roomNo == undefined){
            console.log(inputData);
            this.remakeStructure(inputData);
        }
        else{
            this.newStructure(inputData,roomNo);
        }


    }
    newStructure(image, roomNo){
        this.room_url =roomNo+image;
        this.image = image;
        this.messages = new Array();
        this.linked = null ;
        this.canvas = null;
    }
    remakeStructure(oldData){

        this.room_url = oldData.room_url;
        this.image = oldData.image;
        this.messages = oldData.messages;
        this.linked =  oldData.linked;
        this.canvas = oldData.canvas;
    }

    storeData(){
        storeDataInCache(this.room_url,this)
            .then(t=>console.log("Successfully stored"))
            .catch(e=>console.log("Error saving data:"+e.message))
    }
    addMessage(message){
        this.messages.push(message);
        updateData(this.room_url, this)
            .then(t=>console.log("Successfully Saved message"))
            .catch(e=>console.log("Error saving message:"+e.message))
    }
    updateCanvas(canvas){
        this.canvas = canvas;
        updateData(this.room_url, this)
            .then(t=>console.log("Successfully Saved canvas"))
            .catch(e=>console.log("Error saving canvas:"+e.message))
    }

    addLink(linked){
        this.linked = linked;
        updateData(this.room_url, this)
            .then(t=>console.log("Successfully Saved link"))
            .catch(e=>console.log("Error saving link:"+e.message))
    }

}
window.SpyChat = SpyChat;






const SPYCHAT_DB_NAME = 'db_spychat_1';
const SPYCHAT_STORE_NAME = 'store_spychat';
const IMAGE_STORE = 'image_store';

/**
 *Creates the database with index on room_url
 * @returns {Promise<void>}
 */
async function initDatabase(){
    if (!db){
        db = await idb.openDB(SPYCHAT_DB_NAME, 1, {
            upgrade(upgradeDb, oldVersion, newVersion) {
                if (!upgradeDb.objectStoreNames.contains(SPYCHAT_STORE_NAME)) {
                    let forecastDB = upgradeDb.createObjectStore(SPYCHAT_STORE_NAME, {
                        autoIncrement: true
                    });
                    forecastDB.createIndex('room_url', 'room_url', {unique: true});
                }else{
                    console.log("error on create obj store");
                }
            }
        });

    }
}
window.initDatabase = initDatabase;

/**
 *
 * @param room_url room number + url of photo
 * @param spyChat the spy chat object
 * @returns {Promise<void>}
 */
async function storeDataInCache(room_url,spyChat) {
    console.log('inserting: '+room_url);
    if (!db)
        await initDatabase();
    if (db) {
        let tx = await db.transaction(SPYCHAT_STORE_NAME, 'readwrite');
        await tx.store.add(spyChat);
        await  tx.done;

    }
}
window.storeDataInCache= storeDataInCache;


async function updateData(room_url, data) {
    console.log('updating: '+ room_url);
    if (!db)
        await initDatabase();
    if (db) {
        let tx = await db.transaction(SPYCHAT_STORE_NAME, 'readwrite');
        let key = await tx.store.index('room_url').getKey(room_url);
        if(!(key == undefined)){
            await tx.store.put(data,key);
            await  tx.done;
        }else{
            throw new CustomError('Key not found');
        }



    }
}
window.storeDataInCache= storeDataInCache;

/**
 *
 * @param room_url room number + url of photo
 * @returns {Promise<*>} the chat object
 */
async function getCachedData() {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            //Possibly needs to be edited to make offline
            console.log('fetching data ');
            let tx = await db.transaction(SPYCHAT_STORE_NAME, 'readonly');
            let store = await tx.objectStore(SPYCHAT_STORE_NAME);
            let index = await store.index('room_url');
            let past_chat = await index.getAll();
            await tx.done;
            if (past_chat){
                return past_chat;
            }
            else{
                //@TODO return some sort of error 'chat not found'
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        //@TODO return some sort of error 'no local storage found'
    }
}
window.getCachedData= getCachedData;

