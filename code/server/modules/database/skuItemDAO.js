"use strict"

const db = require('./DAO');

/*SKUITEM ( RFID; SKUID; AVAILABLE, CURRENTPOSITION, DATEOFSTOCK, TESTRESULTLIST*/

exports.newTableSkuItem = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS skuItem (rfid TEXT PRIMARY KEY, skuId INTEGER, available INTEGER,  dateOfStock STRING)';
    return db.run(sql);
}
exports.dropTable = () => {
    const sql = 'DROP TABLE skuItem'
    return db.run(sql);
}
exports.storeSkuItem = (data) => {
    const sql = 'INSERT INTO skuItem (rfid, skuId, available, dateOfStock) VALUES ( ?, ?, 0, ?)';
    return db.run(sql, [data.RFID, data.SKUId, data.DateOfStock]);
}

exports.getSkuItemList = () => {
    const sql = 'SELECT * FROM skuItem';
    return db.all(sql);
}

exports.getSkuItemBySkuId = (skuId) => {
    const sql = 'SELECT rfid, skuId, dateOfStock FROM skuItem WHERE skuId = ? AND available = 1';
    return db.all(sql, [skuId]);
}

exports.getSkuItemByRfid = (rfid) => {
    const sql = 'SELECT * FROM skuItem WHERE rfid = ?'
    return db.get(sql, [rfid]);
}

exports.editInfoSkuItem = (rfid, data) => {
    const sql = 'UPDATE skuItem SET rfid = ?, available = ?, dateOfStock = ? WHERE rfid = ?';
    return db.run(sql, [data.newRFID, data.newAvailable, data.newDateOfStock, rfid]);
}

exports.deleteSkuItemByRfid = (rfid) => {
    const sql = 'DELETE FROM skuItem WHERE rfid = ?';
    return db.run(sql, [rfid]);
}

exports.setAvailable = (rfid, available) => {
    const sql = 'UPDATE skuItem SET available = ? WHERE rfid = ?';
    return db.run(sql, [available, rfid]);
}