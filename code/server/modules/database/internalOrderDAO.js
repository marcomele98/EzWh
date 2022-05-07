"use strict"

const res = require('express/lib/response');
// internalOrders (id, issueDate, state, products, customerId)

const db = require('./DAO');

// function for Internal Order
exports.newTableInternalOrder = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS internalOrders(id integer PRIMARY KEY AUTOINCREMENT, issueDate STRING, state TEXT, products STRING, customerId STRING )';
    return db.run(sql);
}

exports.newTableProducts = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS products(IOId INTEGER, SKUId INTEGER , description TEXT, price float, quantity INTEGER, PRIMARY KEY("IOId","SKUId"))';
    return db.run(sql);
}

exports.newTableSkuIO = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS skuIO (IOid INTEGER, SKUId INTEGER, RFID TEXT PRIMARY KEY)';
    return db.run(sql);
}

exports.storeInternalOrder = (data) => {
    const sql = 'INSERT INTO internalOrders (id, issueDate, state, customerId) VALUES(?, ?, ?, ?)';
    return db.run(sql, [this.lastID, data.issueDate, 'ISSUED', data.customerId])
}

exports.storeProducts = (data, IOid) => {
    const sql1 = 'INSERT INTO Products (IOId, SKUId, description, price, quantity) VALUES(?, ?, ?, ?, ?)'
    for (var i = 0; i < data.length; i++) {
        db.run(sql1, [IOid, data[i].SKUId, data[i].description, data[i].price, data[i].qty])
    }
}

exports.storeSkuIO = (data, IOid) => {
    const sql1 = 'INSERT OR IGNORE INTO skuIO (IOid, SKUId, RFID) VALUES(?, ?, ?)'
    for (var i = 0; i < data.length; i++) {
        db.run(sql1, [IOid, data[i].SkuID, data[i].RFID]);
    }
}

exports.getListProducts = (id) => {
    const sql = 'SELECT SKUId, description, price, quantity FROM products WHERE IOid = ?';
    return db.all(sql, [id]);
}

exports.getListSKU = (id) => {
    const sql = 'SELECT SKUId, RFID FROM skuIO WHERE IOid = ?';
    return db.all(sql, [id]);
}

exports.getLastId = () => {
    const sql = 'SELECT MAX(id) FROM internalOrders';
    return db.get(sql);
}

exports.getListInternalOrders = () => {
    const sql = 'SELECT * FROM internalOrders';
    return db.all(sql, []);
}

exports.getListIssuedInternalOrders = () => {
    const sql = 'SELECT * FROM internalOrders WHERE state = ?';
    return db.all(sql, ['ISSUED']);
}

exports.getListAcceptedInternalOrders = () => {
    const sql = 'SELECT * FROM internalOrders WHERE state = ?';
    return db.all(sql, ['ACCEPTED']);
}

exports.getInternalOrderById = (id) => {
    const prod = this.getListProducts(id)
    const sql = 'SELECT * FROM internalOrders WHERE id = ?';
    const IO = db.get(sql, [id]);
    IO.products = prod;
    return IO;
}

exports.modifyStateInternalOrderById = (data, id) => {
    const sql = 'UPDATE internalOrders SET state = ? WHERE ID = ?';
    return db.run(sql, [data.newState, id]);
}

exports.deleteInternalOrderById = (id) => {
    const sql = 'DELETE FROM internalOrders WHERE id = ?';
    db.run(sql, [id]);
    const sql1 = 'DELETE FROM products WHERE IOid = ?';
    db.run(sql1, [id]);
    const sql2 = 'DELETE FROM skuIO WHERE IOid = ?';
    db.run(sql2, [id]);
};


this.newTableInternalOrder();
this.newTableProducts();
this.newTableSkuIO();