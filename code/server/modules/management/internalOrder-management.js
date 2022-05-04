"use strict"
const DAO = require('../DAO');
const db = new DAO('database');

class InternalOrderManagement {

    constructor() { }

    async createNewInternalOrder(req, res) {
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({ error: `Empty body request` });
        }
        let internalOrder = req.body;
        if (internalOrder.issueDate === '' || internalOrder.producst === '' || internalOrder.customerId === '' ) {
            return res.status(422).json({ error: `Invalid Internal Order data` });
        }
        await db.newTableInternalOrder();
        db.storeInternalOrder(internalOrder);
        return res.status(201).end();
    }

    async getListInternalOrders(req, res) {
        try {
            const listInternalOrders = await db.getListInternalOrders();
            res.status(200).json(listInternalOrders);
        } catch (err) {
            res.status(404).end();
        }
    }

    async getListIssuedInternalOrders(req, res) {
        try {
            const listInternalOrders = await db.getListIssuedInternalOrders();
            res.status(200).json(listInternalOrders);
        } catch (err) {
            res.status(404).end();
        }
    }

    async getListAcceptedInternalOrders(req, res) {
        try {
            const listInternalOrders = await db.getListAcceptedInternalOrders();
            res.status(200).json(listInternalOrders);
        } catch (err) {
            res.status(404).end();
        }
    }

    async getInternalOrderById(req, res) {
        const id = req.params.id;
        if (id == undefined || id == '') {
            return res.status(422).json({ error: `Invalid id` });
        }
        const integerID = parseInt(id, 10);
        try {
            const internalOrder = await db.getInternalOrderById(integerID);
            res.status(200).json(internalOrder);
        } catch (err) {
            res.status(404).end();
        }
    }

    async modifyItemById(req, res) {
        const id = req.params.id;
        const data = req.body;
        if (id == undefined || id == '') {
            return res.status(422).json({ error: `Invalid id` });
        }
        const integerID = parseInt(id, 10);
        try {
            const item = await db.modifyItemById(integerID, data);
            res.status(200).json(item);
        } catch (err) {
            res.status(404).end();
        }
    }

    deleteInternalOrderById(req, res) {
        try {
            db.deleteInternalOrderById(req.params.id);
            res.status(204).end();
        } catch (err) {
            res.status(500).end();
        }
    }
}

module.exports = InternalOrderManagement;
