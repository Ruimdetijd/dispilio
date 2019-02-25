"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xmlio_1 = require("xmlio");
function byteToHex(byte) {
    const hex = ('0' + byte.toString(16)).slice(-2);
    return hex;
}
function generateId(len) {
    var arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    const tail = [].map.call(arr, byteToHex).join("");
    const head = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    return `${head}${tail}`;
}
exports.generateId = generateId;
function fetchXML(url) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest;
        xhr.open('GET', url);
        xhr.responseType = 'document';
        xhr.overrideMimeType('text/xml');
        xhr.onload = function () {
            if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                if (xhr.responseXML == null) {
                    reject('Fetching XML failed');
                    return;
                }
                const xmlio = new xmlio_1.default(xhr.responseXML);
                resolve(xmlio);
            }
        };
        xhr.send();
    });
}
exports.fetchXML = fetchXML;
