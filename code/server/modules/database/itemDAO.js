"use strict"

// items (id, description, price, SKUId, supplierId)

const db = require('./DAO');


// function for Item
exports.newTableItem = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS items(id INTEGER, description TEXT, price FLOAT, SKUId INTEGER, supplierId INTEGER, PRIMARY KEY("id", "supplierId"))';
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

exports.getItemById = (id, supplierId) => {
    const sql = 'SELECT * FROM items WHERE id = ? AND supplierId = ?';
    return db.get(sql, [id, supplierId]);
}

exports.getSkuBySupplier = (skuId, supplierId) => {
    const sql = 'SELECT * FROM items WHERE SKUId = ? AND supplierId = ?';
    return db.get(sql, [skuId, supplierId]);
}

exports.modifyItemById = (id, data, supplierId) => {
    const updateQuery = 'UPDATE items SET description=?, price=? WHERE id=? AND supplierId = ?';
    return db.run(updateQuery, [data.newDescription, data.newPrice, id, supplierId]);
}


exports.deleteItemById = (id, supplierId) => {
    const sql = 'DELETE FROM items WHERE id = ? AND supplierId = ?';
    return db.run(sql, [id, supplierId]);
}

exports.deleteTableContent = () => {
    const query = 'DELETE FROM items';
    return db.run(query, []);
}


this.newTableItem();