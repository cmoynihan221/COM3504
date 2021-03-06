// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

let cache = null;
let dataCacheName = 'spyChatData';
let cacheName = 'spyChat';
let filesToCache = [
    '/',
    '/chats',
    '/searchChats',
    '/media',
    '/allImages',
    '/javascripts/idb/index.js',
    '/javascripts/idb/wrap-idb-value.js',
    '/javascripts/app.js',
    '/javascripts/appMedia.js',
    '/javascripts/canvas.js',
    '/javascripts/database.js',
    '/javascripts/index.js',
    '/javascripts/searchChats.js',
    '/stylesheets/navigation.css',
    '/stylesheets/searchPage.css',
    '/stylesheets/style.css',
    '/../socket.io/socket.io.js',
];

/**
 * installation event: it adds all the files to be cached
 */
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cacheX) {
            console.log('[ServiceWorker] Caching app shell');
            cache= cacheX;
            return cache.addAll(filesToCache);
        })
    );
});


/**
 * activation of service worker: it removes all cashed files if necessary
 */
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    /*
     * Fixes a corner case in which the app wasn't returning the latest data.
     */
    return self.clients.claim();
});


/**
 * this is called every time a file is fetched. This is a middleware, i.e. this method is
 * called every time a page is fetched by the browser
 */
self.addEventListener('fetch', function (e) {
        /*
         * The app is asking for app shell files. In this scenario the app uses the
         * "Cache, falling back to the network" offline strategy:
         * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
         */

        e.respondWith(
            caches.match(e.request).then(function (response) {
                return response
                    || fetch(e.request)
                        .then(function (response) {
                            // note if network error happens, fetch does not return
                            // an error. it just returns response not ok
                            // https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
                            if (!response.ok || response.statusCode > 299) {
                                console.log("error: " + response.error());
                            } else {
                                //when using system online, chats don't send if the below line is uncommented
                                //cache.add(e.request.url);
                                return response;
                            }
                        })
                        .catch(function (err) {
                            console.log("error: " + err);
                        })
            })
        );
});
