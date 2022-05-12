"use strict"

const res = require('express/lib/response');
// returnOrders (id, issueDate, restockOrderID , SKUReturnItemList)

const db = require('./DAO');

// function for Return Order
exports.newTableReturnOrder = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS returnOrders(id integer PRIMARY KEY AUTOINCREMENT, returnDate STRING, restockOrderID INTEGER, SKUReturn STRING )';
    return db.run(sql);
}

exports.newTableProductsRET = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS productsRET(RETid INTEGER, SKUId INTEGER , description TEXT, price float, RFID TEXT, PRIMARY KEY("RETid","RFID"))';   
    return db.run(sql);
}

exports.storeReturnOrder = (data) => {
    const sql = 'INSERT INTO returnOrders (id, returnDate, restockOrderID) VALUES(?, ?, ?)';
    return db.run(sql, [this.lastID, data.returnDate, data.restockOrderID]);
}

exports.storeProductRET = (data, RETid) => {
    const sql1 = 'INSERT INTO productsRET(RETid , SKUId , description , price , RFID ) VALUES(?, ?, ?, ?, ?)'
    for (var i = 0; i < data.length; i++) {
        db.run(sql1, [RETid, data[i].SKUId, data[i].description, data[i].price, data[i].RFID]);
    }
}

exports.getListProductRET = (id) => {
    const sql = 'SELECT RETid , SKUId  , description , price , RFID , RFID FROM productsRET WHERE RETid = ?';
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

exports.dropTable = () =>{
    const sql = 'DROP TABLE returnOrders'
    return db.run(sql);
}

this.newTableReturnOrder();
this.newTableProductsRET();