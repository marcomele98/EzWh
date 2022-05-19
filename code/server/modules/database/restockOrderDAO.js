"use strict"

const res = require('express/lib/response');
// restockOrders (id, issueDate, state, supplierId, transportNote, products , SKUReturnItemList)

const db = require('./DAO');

// function for Restock Order
exports.newTableRestockOrder = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS restockOrders(id integer PRIMARY KEY AUTOINCREMENT, issueDate TEXT, state TEXT, products TEXT, supplierId INTEGER, transportNote TEXT, skuItems TEXT )';
    return db.run(sql);
}

exports.newTableProductsRE = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS productsRE(REid INTEGER, SKUId INTEGER , description TEXT, price float, qty INTEGER, PRIMARY KEY("REid","SKUId"))';
    return db.run(sql);
}

exports.newTableSkuRE = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS skuRE (REid INTEGER, SKUId INTEGER, rfid TEXT PRIMARY KEY)';
    return db.run(sql);
}

exports.newTableTransportNoteRE = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS transportRE (REid INTEGER, deliveryDate TEXT)';
    return db.run(sql);
}

exports.storeRestockOrder = (data) => {
    const sql = 'INSERT INTO restockOrders (id, issueDate, state, supplierId) VALUES(?, ?, ?, ?)';
    return db.run(sql, [this.lastID, data.issueDate, 'ISSUED', data.supplierId]);
}

exports.storeProducts = (data, REid) => {
    const sql1 = 'INSERT INTO productsRE (REid, SKUId, description, price, qty) VALUES(?, ?, ?, ?, ?)'
    for (var i = 0; i < data.length; i++) {
        db.run(sql1, [REid, data[i].SKUId, data[i].description, data[i].price, data[i].qty]);
    }
}

exports.storeSkuRE = (data, REid) => {
    const sql1 = 'INSERT INTO skuRE (REid, SKUId, rfid) VALUES(?, ?, ?)';
    for (var i = 0; i < data.skuItems.length; i++) {
        db.run(sql1, [REid, data.skuItems[i].SKUId, data.skuItems[i].rfid]);
    }
}

exports.storeTransportNote = (data, REid) => {
    const sql1 = 'INSERT INTO transportRE (REid, deliveryDate) VALUES(?, ?)';
    return db.run(sql1, [REid, data.transportNote.deliveryDate]);
}

exports.getListProducts = (id) => {
    const sql = 'SELECT SKUId, description, price, qty FROM productsRE WHERE REid = ?';
    return db.all(sql, [id]);
}

exports.getListSKURE = (id) => {
    const sql = 'SELECT SKUId, rfid FROM skuRE WHERE REid = ?';
    return db.all(sql, [id]);
}

exports.getTransportNote = (id) => {
    const sql = 'SELECT deliveryDate FROM transportRE WHERE REid = ?';
    return db.get(sql, [id]);
}

exports.getLastId = () => {
    const sql = 'SELECT MAX(id) FROM restockOrders';
    return db.get(sql);
}

exports.getListRestockOrders = () => {
    const sql = 'SELECT * FROM restockOrders';
    return db.all(sql);
}

exports.getListIssuedRestockOrders = () => {
    const sql = 'SELECT * FROM restockOrders WHERE state = ?';
    return db.all(sql, ['ISSUED']);
}

exports.getRestockOrderById = (id) => {
    const prod = this.getListProducts(id);
    const ret = this.getListSKURE(id);
    const trans = this.getTransportNote(id);
    const sql = 'SELECT * FROM restockOrders WHERE id = ?';
    const RE = db.get(sql, [id]);
    RE.products = prod;
    RE.transportNote = trans;
    RE.SKUItems = ret;
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
    const sql3 = 'DELETE FROM skuRE WHERE REid = ?';
    db.run(sql3, [id]);
    const sql4 = 'DELETE FROM transportRE WHERE REid = ?';
    db.run(sql4, [id]);
};

exports.dropTable = () =>{
    const sql = 'DROP TABLE restockOrders'
    return db.run(sql);
}

exports.deleteTableContent = () => {
    const query = 'DELETE FROM restockOrders';
    return db.run(query, []);
}



this.newTableRestockOrder();

this.newTableProductsRE();
this.newTableSkuRE();
this.newTableTransportNoteRE();