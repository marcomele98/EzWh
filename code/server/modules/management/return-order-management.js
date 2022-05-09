"use strict"

const dayjs = require('dayjs');
const db = require('../database/returnOrderDAO');

class ReturnOrderManagement {

    constructor() { }

    async createNewReturnOrder(req, res) {
        let returnOrder = req.body;
        if (returnOrder === undefined || returnOrder.issueDate === undefined || returnOrder.SKUItem === undefined || returnOrder.restockOrderId === undefined
            || returnOrder == '' || returnOrder.issueDate === '' || returnOrder.SKUItem === '' || returnOrder.restockOrderId === "" || returnOrder.restockOrderId == 0
            || isNaN(returnOrder.restockOrderId) || dayjs(returnOrder.issueDate, 'YYYY-MM-DD HH:mm', true).isValid() !== true) {
            return res.status(422).end();
        }
        try {
            await db.storeReturnOrder(returnOrder);
            const RET = await db.getLastId();
            db.storeProducts(returnOrder.SKUItem, RET["MAX(id)"]);
            return res.status(201).end();
        }
        catch (err) {
            return res.status(503).end();
        }
    }


    async getListReturnOrder(req, res) {
        try {
            const listReturnOrders = await db.getListReturnOrders();
            for (var i = 0; i < listReturnOrders.length; i++) {
                const SKUItem = await db.getListSKURET(listReturnOrders[i].id);
                listReturnOrders[i].SKUItem = SKUItem;
            }
            res.status(200).json(listReturnOrders);
        } catch (err) {
            res.status(500).end();
        }
    }

    async getReturnOrderById(req, res) {
        const id = req.params.id;
        if (id == undefined || id == '' || isNaN(id)) {
            return res.status(422).end();
        }
        try {
            const returnOrder = await db.getReturnOrderById(id);
            if (returnOrder == undefined) {
                return res.status(404).end();
            }

            const SKUItem = await db.getListSKURET(id);
            returnOrder.SKUItem = SKUItem;
            
            return res.status(200).json(returnOrder);
        } catch (err) {
            res.status(500).end();
        }
    }

    async deleteReturnOrderById(req, res) {
        const id = req.params.id;
        if (id == undefined || id == '' || isNaN(id)) {
            return res.status(422).end();
        }
        try {
            db.deleteReturnOrderById(id);
            res.status(204).end();
        } catch (err) {
            res.status(500).end();
        }
    }
    
}

module.exports = ReturnOrderManagement;