import * as idb from './idb/index.js';
let db;

/**
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
        storeDataInCache(this, SPYCHAT_STORE_NAME)
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

class localImage{
    constructor(user_id, image_blob) {
        this.user = user_id;
        this.user_id_image = user_id + image_blob;
        this.image = image_blob;
    }
    storeData(){
        storeDataInCache(this, IMAGE_STORE_NAME)
            .then(t=>console.log("Successfully stored"))
            .catch(e=>console.log("Error saving data:"+e.message))
    }
}
window.localImage = localImage;



const SPYCHAT_DB_NAME = 'db_spychat_1';
const SPYCHAT_STORE_NAME = 'store_spychat';
const IMAGE_STORE_NAME = 'image_store';
const IMAGE_TO_UPLOAD = 'upload_store'

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
                if (!upgradeDb.objectStoreNames.contains(IMAGE_STORE_NAME)) {
                    let forecastDB = upgradeDb.createObjectStore(IMAGE_STORE_NAME, {
                        autoIncrement: true
                    });
                    forecastDB.createIndex('user_id_image', 'user_id_image', {unique: true});
                }else{
                    console.log("error on create image store");
                }
                if (!upgradeDb.objectStoreNames.contains(IMAGE_TO_UPLOAD)) {
                    let forecastDB = upgradeDb.createObjectStore(IMAGE_TO_UPLOAD, {
                        autoIncrement: true
                    });
                }else{
                    console.log("error on create image store");
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
async function storeDataInCache(data, DB_name) {
    if (!db)
        await initDatabase();
    if (db) {
        let tx = await db.transaction(DB_name, 'readwrite');
        await tx.store.add(data);
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
window.updateDate= updateData;

/**
 *
 * @param room_url room number + url of photo
 * @returns {Promise<*>} the chat object
 */
async function getCachedData(store_name) {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            //Possibly needs to be edited to make offline
            console.log('fetching data ');
            let tx = await db.transaction(store_name, 'readonly');
            let store = await tx.objectStore(store_name);
            let data = await store.getAll();
            await tx.done;
            if (data){
                return data;
            }
            else{
                throw 'data not found';
            }
        } catch (error) {
            throw error;
        }
    } else {
        throw 'DB failed'
    }
}
window.getCachedData= getCachedData;

/**
 *
 * @param store_name db store
 * @param key value to find
 * @returns {Promise<*>} the chat object
 */
async function getData(store_name,key ) {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            let tx = await db.transaction(store_name, 'readonly');
            let store = await tx.objectStore(store_name);
            let data = await store.get(key);
            await tx.done;
            if (data){
                return data;
            }
            else{
                throw 'data not found';
            }
        } catch (error) {
            throw error;
        }
    } else {
        throw 'DB failed'
    }
}
window.getData= getData;


async function wipeData(store_name) {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            let tx = await db.transaction(store_name, 'readwrite');
            let store = await tx.objectStore(store_name);
            let data = await store.clear();
        } catch (error) {
            throw error;
        }
    } else {
        throw 'DB failed'
    }
}
window.wipeData= wipeData;