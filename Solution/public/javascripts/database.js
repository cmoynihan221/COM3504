import * as idb from 'idb';
let db;

async function initDatabase(){
    if (!db){
        db = await idb.openDB(


        )
    }
}