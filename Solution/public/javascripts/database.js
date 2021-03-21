import * as idb from './idb/index.js';
let db;

const SPYCHAT_DB_NAME = 'db_spychat_1';
const SPYCHAT_STORE_NAME = 'store_spychat';

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
                        keyPath: 'id',
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
async function storeDataInCache(room_url, spyChat) {
    console.log('inserting: '+JSON.stringify(spyChat));
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(SPYCHAT_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(SPYCHAT_STORE_NAME);
            await store.put(spyChat);
            await  tx.done;
            console.log('added item to the store! '+ JSON.stringify(spyChat));
        } catch(error) {
            //@TODO remove the localStorage methods
            localStorage.setItem(room_url, JSON.stringify(spyChat));
        };
    }
    else localStorage.setItem(room_url, JSON.stringify(spyChat));
}
window.storeDataInCache= storeDataInCache;

/**
 *
 * @param room_url room number + url of photo
 * @returns {Promise<*>} the chat object
 */
async function getCachedData(room_url) {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            //Possibly needs to be edited to make offline
            console.log('fetching: ' + room_url);
            let tx = await db.transaction(SPYCHAT_STORE_NAME, 'readonly');
            let store = await tx.objectStore(SPYCHAT_STORE_NAME);
            let index = await store.index('room_url');
            let past_chat = await index.getAll(IDBKeyRange.only(room_url));
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