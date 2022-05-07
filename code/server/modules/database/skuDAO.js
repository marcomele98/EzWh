'use strict'

const db = require('./DAO');

exports.newTableSku = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS sku(ID INTEGER PRIMARY KEY, DESCRIPTION STRING, WEIGHT FLOAT, VOLUME FLOAT, PRICE FLOAT, NOTES STRING, AVAILABLEQUANTITY INTEGER, POSITIONID INTEGER, TESTLIST STRING)';
    return db.run(sql);
}

exports.getSkuList = () => {
    const sql = 'SELECT * FROM sku';
    return db.all(sql);
}

exports.getSkuById = (id) => {
    const sql = 'SELECT * FROM sku WHERE ID = ?';
    return db.get(sql, [id]);
}

exports.addSku = (data) => {
    const sql = 'INSERT INTO sku (ID, DESCRIPTION, WEIGHT, VOLUME, PRICE, NOTES, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?)';
    return db.run(sql, [data.id, data.description, data.weight, data.volume, data.price, data.notes, data.availableQuantity]);
}

exports.updateSkuInfo = (id, data) => {
    const sql = 'UPDATE sku SET DESCRIPTION = ?, WEIGHT = ?, VOLUME = ?,  NOTES = ?, PRICE = ?, AVAILABLEQUANTITY = ?  WHERE ID = ?';
    return db.run(sql, [data.newDescription, data.newWeight, data.newVolume, data.newNotes, data.newPrice, data.newAvailableQuantity, id]);
}


exports.setPosition = (id, position) => {
    const sql = 'UPDATE sku SET POSITIONID = ? WHERE ID = ?';
    return db.run(sql, [position.position, id]);
}

exports.deleteSkuById = (id) => {
    const sql = 'DELETE FROM sku WHERE ID = ?';
    return db.run(sql, [id]);
}

exports.updateQuantity = (id, quantity) => {
    const sql = 'UPDATE sku SET AVAILABLEQUANTITY = ? WHERE ID = ?'
    return db.run(sql, [quantity, id]);
}