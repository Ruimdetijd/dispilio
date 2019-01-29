"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
