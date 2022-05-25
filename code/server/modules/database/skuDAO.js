'use strict'

const db = require('./DAO');
 /*SKU (id, description, weight,volume, notes, position, availableQuantity, price, testDescriptors)*/
exports.newTableSku = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS sku(id INTEGER PRIMARY KEY, description TEXT, weight INTEGER, volume INTEGER,  notes TEXT, position TEXT, availableQuantity INTEGER, price FLOAT,  testDescriptors TEXT)';
    return db.run(sql);
}
   
exports.getSkuList = () => {
    const sql = 'SELECT * FROM sku';
    return db.all(sql);
}

exports.getSkuById = (id) => {
    const sql = 'SELECT * FROM sku WHERE id = ?';
    return db.get(sql, [id]);
}

exports.addSku = (data) => {
    const sql = 'INSERT INTO sku (description, weight, volume, notes, availableQuantity, price) VALUES (?, ?, ?, ?, ?, ?)';
    return db.run(sql, [data.description, data.weight, data.volume,  data.notes, data.availableQuantity, data.price]);
}

exports.updateSkuInfo = (id, data) => {
    const sql = 'UPDATE sku SET description = ?, weight = ?, volume = ?, notes = ?, availableQuantity = ?, price = ?  WHERE id = ?';
    return db.run(sql, [data.newDescription, data.newWeight, data.newVolume, data.newNotes, data.newAvailableQuantity, data.newPrice, id]);
}


exports.setPosition = (id, position) => {
    const sql = 'UPDATE sku SET position = ? WHERE id = ?';
    return db.run(sql, [position, id]);
}

exports.deleteSkuById = (id) => {
    const sql = 'DELETE FROM sku WHERE id = ?';
    return db.run(sql, [id]);
}

exports.updateQuantity = (id, quantity) => {
    const sql = 'UPDATE sku SET availableQuantity = ? WHERE id = ?'
    return db.run(sql, [quantity, id]);
}

exports.deleteTableContent = () => {
    const sql = 'DELETE FROM sku'
    db.run(sql);

}

exports.resetTable = () =>{
    const sql = 'DELETE FROM sqlite_sequence WHERE NAME = sku'
    db.run(sql);
}

this.newTableSku();