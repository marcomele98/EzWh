"use strict"

// positions (positionID, aisleID, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume)

const db = require('./DAO');

exports.newTablePositions = () => {
    const query = 'CREATE TABLE IF NOT EXISTS POSITIONS(positionID STRING PRIMARY KEY, aisleID STRING, row STRING, col STRING, maxWeight NUMBER, maxVolume NUMBER, occupiedWeight NUMBER, occupiedVolume NUMBER)'
    return db.run(query, []);
}

exports.dropPositions = () => {
    const query = 'DROP TABLE POSITIONS';
    return db.run(query, []);
}

// this fn returns the list of all positions in the database
exports.getListAllPositionsWH = () => {
    const query = 'SELECT * FROM POSITIONS';
    return db.all(query, []);
}

// fn that returns a position given its id
exports.getPositionByID = (id) => {
    const query = 'SELECT * FROM POSITIONS WHERE positionID = ?';
    return db.get(query, [id]);
}

//fn that creates a new tuple of position in db
exports.createNewPositionWH = (data) => {
    const query = 'INSERT INTO POSITIONS  (positionID, aisleID, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    return db.run(query, [data.positionID, data.aisleID, data.row, data.col, data.maxWeight, data.maxVolume, 0, 0]);
}

//fn that modifies the attributes of a position tuple in db
exports.modifyPositionAttributes = (data, newId, oldId) => {
    const query = 'UPDATE POSITIONS SET positionID = ?, aisleID = ?, row = ?, col = ?, maxWeight= ?, maxVolume= ?, occupiedWeight= ?, occupiedVolume= ? WHERE positionID = ?';
    return db.run(query, [newId, data.newAisleID, data.newRow, data.newCol, data.newMaxWeight, data.newMaxVolume, data.newOccupiedWeight, data.newOccupiedVolume, oldId]);
}

exports.updateInfoBySKU = (id, newWeight, newVolume) => {
    const sql = 'UPDATE POSITIONS SET occupiedWeight = ?, occupiedVolume = ? WHERE positionID = ?';
    return db.run(sql, [newWeight, newVolume, id]);
}
// this fn modifies the id of a position, leaving all its other attributes unmodified
exports. modifyPositionID = (oldId, newId, aisle, row, col) => {
    const query = 'UPDATE POSITIONS SET positionID = ?, aisleID = ?, row = ?, col = ? WHERE positionID = ?';
    return db.run(query, [newId, aisle, row, col, oldId]);
}

// this fn deletes a position in the database give its id
exports.deletePositionWHByID = (id) => {
    const query = 'DELETE FROM POSITIONS WHERE positionID = ?';
    return db.run(query, [id]);
}

this.newTablePositions();