"use strict"

const DAO = require ("../DAO");
const db = new DAO ("database");

function Position(id, aisle, row, column, maxWeight, maxVolume, occupiedWeight, occupiedVolume) {
    this.id = id;
    this.aisle = aisle;
    this.row = row;
    this.column = column;
    this.maxWeight = maxWeight;
    this.maxVolume = maxVolume;
    this.occupiedWeight = occupiedWeight;
    this.occupiedVolume = occupiedVolume;
}

const mapToPosition = dbRow => new Position(dbRow.id, dbRow.aisle, dbRow.row, dbRow.column,
    dbRow.maxWeight, dbRow.maxVolume, dbRow.occupiedWeight, dbRow.occupiedVolume);

function PositionManagement() {

    this.getListAllPositionsWH = async (req, res) => {
        try{
            const positionsList = await db.getListAllPositionsWH();
            return res.status(200).json(positionsList);
        } catch(err){
            res.status(501).end();
        }
    }
}

module.exports = PositionManagement;