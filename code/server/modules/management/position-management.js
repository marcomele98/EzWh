'use strict'

const db = require('../database/positionDAO');

class PositionManagement {

    constructor() { }

    noContent = (data) => {
        return data=== null || data === undefined;
    }

    isNotValidAisleID = (aisleID) => {
        return aisleID === null || aisleID === undefined || aisleID.length !== 4
    }

    isNotValidRow = (row) => {
        return row === null || row === undefined || row.length !== 4
    }

    isNotValidCol = (col) => {
        return col === null || col === undefined || col.length !== 4
    }

    verifyPositionID = (positionID, aisleID, row, col) => {
        return (positionID !== (aisleID+row+col));
    }

    isNotValidPositionID = (positionID) => {
        return positionID === undefined || positionID === null || positionID.length !== 12;
    }

    isNotValidWeight_Volume = (val) => {
        return this.noContent(val) || isNaN(val) || val <= 0;
    }

    isNotValidBody = (data) => {
        return data === undefined || data === null || data.length === 0;
    }

    async getListAllPositionsWH(req, res) {
        try {
            const listPositions = await db.getListAllPositionsWH();
            res.status(200).json(listPositions);
        } catch (err) {
            res.status(500).end();
        }
    }

    async createNewPosition(req, res) {
        const data = req.body;
        if ( this.isNotValidBody(data) || this.isNotValidPositionID(data.positionID) ||
            this.isNotValidAisleID(data.aisleID) || this.isNotValidRow(data.row) || this.isNotValidCol(data.col) ||
            this.verifyPositionID(data.positionID, data.aisleID, data.row, data.col) ||
            this.isNotValidWeight_Volume(data.maxWeight) || this.isNotValidWeight_Volume(data.maxVolume)) {
            return res.status(422).end();
        }
        try {
            await db.createNewPositionWH(data);
            res.status(201).end();
        } catch (err) {
            res.status(503).end();
        }
    }

    async modifyPositionAttributes(req, res) {
        const data = req.body;
        const id = req.params.positionID;
        if (this.isNotValidBody(data) || this.isNotValidAisleID(data.newAisleID) || 
            this.isNotValidRow(data.newRow) || this.isNotValidCol(data.newCol) ||
            this.isNotValidWeight_Volume(data.newMaxWeight) || this.isNotValidWeight_Volume(data.newMaxVolume) ||
            this.isNotValidWeight_Volume(data.newOccupiedWeight) || this.isNotValidWeight_Volume(data.newOccupiedVolume) ||
            this.isNotValidPositionID(id)
            ) {
            return res.status(422).end();
        }
        try {
            const tuple = await db.getPositionByID(id);
            const newId = data.newAisleID + data.newRow + data.newCol;
            if (this.noContent(tuple)){
                return res.status(404).end();
            }
            await db.modifyPositionAttributes(data, newId, id);
            res.status(200).end();
        } catch (err) {
            res.status(503).end();
        }
    }

    async modifyPositionID(req, res) {
        const newId = req.body.newPositionID;
        const oldId = req.params.positionID;
        if ( this.isNotValidBody(req.body) || this.isNotValidPositionID(oldId) ||
             this.isNotValidPositionID(newId) ) {
            return res.status(422).end();
        }
        try {
            const tuple = await db.getPositionByID(oldId);
            if (this.noContent(tuple)){
                return res.status(404).end();
            }
            const aisle = newId.slice(0, 4);
            const row = newId.slice(4, 8);
            const col = newId.slice(8, 12);
            await db.modifyPositionID(oldId, newId, aisle, row, col);
            res.status(200).end();
        } catch (err) {
            res.status(503).end();
        }
    }

    async deletePositionWHByID(req, res) {
        const id = req.params.positionID;
        if (this.isNotValidPositionID(id)) {
            return res.status(422).end();
        }
        try {
            await db.deletePositionWHByID(id);
            res.status(204).end();
        } catch (err) {
            res.status(503).end();
        }
    }
}

module.exports = PositionManagement;