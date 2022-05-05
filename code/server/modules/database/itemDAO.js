"use strict"

// items (id, description, price, SKUId, supplierId)

const db = require('./DAO');

// function for Item
exports.newTableItem = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS items(id INTEGER PRIMARY KEY , description STRING, price FLOAT, SKUId INTEGER, supplierId INTEGER )';
    return db.run(sql);
}

exports.storeItem = (data) => {
    const sql = 'INSERT INTO items (id, description, price, skuId, supplierId) VALUES(?, ?, ?, ?, ?)';
    return db.run(sql, [data.id, data.description, data.price, data.SKUId, data.supplierId]);
}

exports.getListItems = () => {
    const sql = 'SELECT * FROM items';
    return db.all(sql);
}

exports.getItemById = (id) => {
    const sql = 'SELECT * FROM items WHERE id = ?';
    return db.get(sql, [id]);
}

exports.getSkuBySupplier = (skuId, supplierId) => {
    const sql = 'SELECT * FROM items WHERE SKUId = ? AND supplierId = ?';
    return db.get(sql, [skuId, supplierId]);
}

exports.modifyItemById = (id, data) => {
    const updateQuery = 'UPDATE items SET description = ?, price = ? WHERE id = ?';
    return db.run(updateQuery, [data.newDescription, data.newPrice, id]);
}


exports.deleteItemById = (id) => {
    const sql = 'DELETE FROM items WHERE id = ?';
    return db.run(sql, [id]);
}