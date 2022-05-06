'use strict'

const db = require('../database/positionDAO');

class PositionManagement {

    constructor() { }

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
        if (data.length === 0 || data.positionID.length !== 12 || data.aisleID.length !== 4 || data.row.length !== 4 || data.col.length !== 4 ||
            data.maxWeight === 0 || data.maxVolume === 0) {
            return res.status(422).end();
        }
        const id = data.aisleID + data.row + data.col;
        if (id !== data.positionID){
            return res.status(422).end();
        }
        try {
            db.createNewPositionWH(data);
            res.status(201).end();
        } catch (err) {
            res.status(503).end();
        }
    }

    async modifyPositionAttributes(req, res) {
        const data = req.body;
        if (data.length === 0 || req.params.positionID.length !== 12 || data.newAisleID.length !== 4 || data.newRow.length !== 4 || data.newCol.length !== 4 ||
            data.newMaxWeight === 0 || data.newMaxVolume === 0 || data.newOccupiedVolume < 0 || data.newOccupiedWeight < 0) {
            return res.status(422).end();
        }
        try {
            const id = req.params.positionID;
            const tuple = await db.getPositionByID(id);
            const newId = data.newAisleID + data.newRow + data.newCol;
            if (tuple === undefined){
                return res.status(404).end();
            }
            db.modifyPositionAttributes(data, newId);
            res.status(200).end();
        } catch (err) {
            res.status(503).end();
        }
    }

    async modifyPositionID(req, res) {
        const newId = req.body.newPositionID;
        const oldId = req.params.positionID;
        if (req.body.length === 0 || oldId.length !== 12 || newId.length !== 12) {
            return res.status(422).end();
        }
        try {
            const tuple = await db.getPositionByID(oldId);
            if (tuple === undefined){
                return res.status(404).end();
            }
            const aisle = newId.slice(0, 4);
            const row = newId.slice(4, 8);
            const col = newId.slice(8, 12);
            db.modifyPositionID(oldId, newId, aisle, row, col);
            res.status(200).end();
        } catch (err) {
            res.status(503).end();
        }
    }

    async deletePositionWHByID(req, res) {
        const id = req.params.positionID;
        if (id.length !== 12) {
            return res.status(422).end();
        }
        try {
            db.deletePositionWHByID(id);
            res.status(204).end();
        } catch (err) {
            res.status(503).end();
        }
    }
}

module.exports = PositionManagement;