"use strict"

const res = require('express/lib/response');
// returnOrders (id, issueDate, restockOrderID , SKUReturnItemList)

const db = require('./DAO');

// function for Return Order
exports.newTableReturnOrder = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS returnOrders(id integer PRIMARY KEY AUTOINCREMENT, returnDate TEXT, products TEXT, restockOrderId INTEGER )';
    return db.run(sql);
}

exports.newTableProductsRET = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS productsRET(RETid INTEGER, SKUId INTEGER, itemId INTEGER, description TEXT, price float, RFID TEXT, PRIMARY KEY("RETid","RFID"))';   
    return db.run(sql);
}

exports.storeReturnOrder = (data) => {
    const sql = 'INSERT INTO returnOrders (id, returnDate, restockOrderId) VALUES(?, ?, ?)';
    return db.run(sql, [this.lastID, data.returnDate, data.restockOrderId]);
}

exports.storeProductRET = (data, RETid) => {
    const sql1 = 'INSERT INTO productsRET(RETid , SKUId , itemId, description , price , RFID ) VALUES(?, ?, ?, ?, ?)'
    for (var i = 0; i < data.length; i++) {
        db.run(sql1, [RETid, data[i].SKUId, data[i].itemId , data[i].description, data[i].price, data[i].RFID]);
    }
}

exports.getListProductRET = (id) => {
    const sql = 'SELECT SKUId , itemId , description , price , RFID , RFID FROM productsRET WHERE RETid = ?';
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
    const ret = this.getListProductRET(id);
    const sql = 'SELECT * FROM returnOrders WHERE id = ?';
    const RET = db.get(sql, [id]);
    RET.products = ret;
    return RET;
}

exports.deleteReturnOrderById = (id) => {
    const sql = 'DELETE FROM returnOrders WHERE id = ?';
    db.run(sql, [id]);
    const sql3 = 'DELETE FROM productsRET WHERE RETid = ?';
    db.run(sql3, [id]);
};

exports.deleteTableContent = () => {
    const query = 'DELETE FROM returnOrders';
    db.run(query, []);
    const query2 = 'UPDATE sqlite_sequence SET seq=0 WHERE name=?';
    db.run(query2, ['returnOrders']);
    const query1 = 'DELETE FROM productsRET';
    return db.run(query1, []);
}

this.newTableReturnOrder();
this.newTableProductsRET();