"use strict"

const res = require('express/lib/response');
// returnOrders (id, issueDate, restockOrderID , SKUReturnItemList)

const db = require('./DAO');

// function for Return Order
exports.newTableReturnOrder = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS returnOrders(id integer PRIMARY KEY AUTOINCREMENT, issueDate STRING, restockOrderID INTEGER, SKUReturn STRING )';
    return db.run(sql);
}

exports.newTableSkuRET = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS skuRET (RETid INTEGER, SKUId INTEGER, RFID TEXT PRIMARY KEY)';
    return db.run(sql);
}

exports.storeReturnOrder = (data) => {
    const sql = 'INSERT INTO returnOrders (id, issueDate, restockOrderID) VALUES(?, ?, ?)';
    return db.run(sql, [this.lastID, data.issueDate, data.restockOrderID]);
}

exports.storeSkuRET = (data, RETid) => {
    const sql1 = 'INSERT OR IGNORE INTO skuRET (RETid, SKUId, RFID) VALUES(?, ?, ?)'
    for (var i = 0; i < data.length; i++) {
        db.run(sql1, [RETid, data[i].SkuID, data[i].RFID]);
    }
}

exports.getListSKURET = (id) => {
    const sql = 'SELECT SKUId, RFID FROM skuRET WHERE RETid = ?';
    return db.all(sql, [id]);
}

exports.getLastId = () => {
    const sql = 'SELECT MAX(id) FROM returnOrders';
    return db.get(sql);
}

exports.getListReturnOrders = () => {
    const sql = 'SELECT * FROM returnOrders';
    return db.all(sql, []);
}

exports.getReturnOrderById = (id) => {
    const ret = this.getListSKURET(id);
    const sql = 'SELECT * FROM returnOrders WHERE id = ?';
    const RET = db.get(sql, [id]);
    RET.SKUReturn = ret;
    return RET;
}

exports.deleteReturnOrderById = (id) => {
    const sql = 'DELETE FROM returnOrders WHERE id = ?';
    db.run(sql, [id]);
    const sql3 = 'DELETE FROM skuRET WHERE RETid = ?';
    db.run(sql3, [id]);
};

this.newTableReturnOrder();
this.newTableSkuRET();