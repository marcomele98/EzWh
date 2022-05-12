"use strict"

const db = require('./DAO');

/*SKUITEM ( RFID; SKUID; AVAILABLE, CURRENTPOSITION, DATEOFSTOCK, TESTRESULTLIST*/

exports.newTableSkuItem = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS skuItem (RFID TEXT PRIMARY KEY, SKUId INTEGER, Available INTEGER,  DateOfStock TEXT)';
    return db.run(sql);
}
exports.dropTable = () => {
    const sql = 'DROP TABLE skuItem'
    return db.run(sql);
}
exports.storeSkuItem = (data) => {
    const sql = 'INSERT INTO skuItem (RFID, SKUId, Available, DateOfStock) VALUES ( ?, ?, 0, ?)';
    return db.run(sql, [data.RFID, data.SKUId, data.DateOfStock]);
}

exports.getSkuItemList = () => {
    const sql = 'SELECT * FROM skuItem';
    return db.all(sql);
}

exports.getSkuItemBySkuId = (skuId) => {
    const sql = 'SELECT RFID, SKUId, DateOfStock FROM skuItem WHERE SKUId = ? AND Available = 1';
    return db.all(sql, [skuId]);
}

exports.getSkuItemByRfid = (rfid) => {
    const sql = 'SELECT * FROM skuItem WHERE RFID = ?'
    return db.get(sql, [rfid]);
}

exports.editInfoSkuItem = (rfid, data) => {
    const sql = 'UPDATE skuItem SET RFID = ?, Available = ?, DateOfStock = ? WHERE RFID = ?';
    return db.run(sql, [data.newRFID, data.newAvailable, data.newDateOfStock, rfid]);
}

exports.deleteSkuItemByRfid = (rfid) => {
    const sql = 'DELETE FROM skuItem WHERE RFID = ?';
    return db.run(sql, [rfid]);
}

exports.setAvailable = (rfid, available) => {
    const sql = 'UPDATE skuItem SET available = ? WHERE RFID = ?';
    return db.run(sql, [available, rfid]);
}

this.newTableSkuItem();