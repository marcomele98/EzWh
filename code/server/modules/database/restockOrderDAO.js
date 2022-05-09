"use strict"

const res = require('express/lib/response');
// restockOrders (id, issueDate, state, supplierId, transportNote, products , SKUReturnItemList)

const db = require('./DAO');

// function for Restock Order
exports.newTableRestockOrder = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS restockOrders(id integer PRIMARY KEY AUTOINCREMENT, issueDate STRING, state TEXT, transportNote STRING, products STRING, customerId STRING, SKUReturn STRING )';
    return db.run(sql);
}

exports.newTableProducts = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS productsRE(REid INTEGER, SKUId INTEGER , description TEXT, price float, quantity INTEGER, PRIMARY KEY("REid","SKUId"))';
    return db.run(sql);
}

exports.newTableSkuRET = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS skuRET (REid INTEGER, SKUId INTEGER, RFID TEXT PRIMARY KEY)';
    return db.run(sql);
}

exports.newTableTransportNoteRE = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS transportRE (REid INTEGER, deliveryDate STRING)';
    return db.run(sql);
}

exports.storeRestockOrder = (data) => {
    const sql = 'INSERT INTO restockOrders (id, issueDate, state, supplierId) VALUES(?, ?, ?, ?)';
    return db.run(sql, [this.lastID, data.issueDate, 'ISSUED', data.supplierId]);
}

exports.storeProducts = (data, REid) => {
    const sql1 = 'INSERT INTO productsRE (REid, SKUId, description, price, quantity) VALUES(?, ?, ?, ?, ?)'
    for (var i = 0; i < data.length; i++) {
        db.run(sql1, [REid, data[i].SKUId, data[i].description, data[i].price, data[i].qty]);
    }
}

exports.storeSkuRET = (data, REid) => {
    const sql1 = 'INSERT OR IGNORE INTO skuRET (REid, SKUId, RFID) VALUES(?, ?, ?)'
    for (var i = 0; i < data.length; i++) {
        db.run(sql1, [REid, data[i].SkuID, data[i].RFID]);
    }
}

exports.storeTransportNote = (data, REid) => {
    const sql1 = 'INSERT INTO transportRE (REid, deliveryDate) VALUES(?, ?)';
    return db.run(sql1, [REid, data.deliveryDate]);
}

exports.getListProducts = (id) => {
    const sql = 'SELECT SKUId, description, price, quantity FROM productsRE WHERE REid = ?';
    return db.all(sql, [id]);
}

exports.getListSKURET = (id) => {
    const sql = 'SELECT SKUId, RFID FROM skuRET WHERE REid = ?';
    return db.all(sql, [id]);
}

exports.getTransportNote = (id) => {
    const sql = 'SELECT deliveryDate FROM transportRE WHERE REid = ?';
    return db.all(sql, [id]);
}

exports.getLastId = () => {
    const sql = 'SELECT MAX(id) FROM restockOrders';
    return db.get(sql);
}

exports.getListRestockOrders = () => {
    const sql = 'SELECT * FROM restockOrders';
    return db.all(sql, []);
}

exports.getListIssuedRestockOrders = () => {
    const sql = 'SELECT * FROM restockOrders WHERE state = ?';
    return db.all(sql, ['ISSUED']);
}

exports.getRestockOrderById = (id) => {
    const prod = this.getListProducts(id);
    const ret = this.getListSKURET(id);
    const trans = this.getTransportNote(id);
    const sql = 'SELECT * FROM restockOrders WHERE id = ?';
    const RE = db.get(sql, [id]);
    RE.products = prod;
    RE.transportNote = trans;
    RE.SKUReturn = ret;
    return RE;
}

exports.modifyStateRestockOrderById = (data, id) => {
    const sql = 'UPDATE restockOrders SET state = ? WHERE ID = ?';
    return db.run(sql, [data.newState, id]);
}

exports.deleteRestockOrderById = (id) => {
    const sql = 'DELETE FROM restockOrders WHERE id = ?';
    db.run(sql, [id]);
    const sql1 = 'DELETE FROM productsRE WHERE REid = ?';
    db.run(sql1, [id]);
    const sql3 = 'DELETE FROM skuRET WHERE REid = ?';
    db.run(sql3, [id]);
    const sql4 = 'DELETE FROM transportRE WHERE REid = ?';
    db.run(sql4, [id]);
};


this.newTableInternalOrder();
this.newTableProductsRE();
this.newTableSkuRET();
this.newTableTransportNoteRE();