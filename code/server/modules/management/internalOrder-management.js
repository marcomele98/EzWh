"use strict"

const db = require('../database/internalOrderDAO');

class InternalOrderManagement {

    constructor() { }

    async createNewInternalOrder(req, res) {
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({ error: `Empty body request` });
        }
        let internalOrder = req.body;
        if (internalOrder.issueDate === '' || internalOrder.products === '' || internalOrder.customerId === '' ) {
            return res.status(422).json({ error: `Invalid Internal Order data` });
        }
        await db.newTableInternalOrder();
        await db.newTableProducts();
        await db.newTableSkuIO();
        await db.storeInternalOrder(internalOrder);
        const IO = await db.getLastId();
        db.storeProducts(internalOrder.products, IO["MAX(id)"]);
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
        try {
            const internalOrder = await db.getInternalOrderById(id);
            res.status(200).json(internalOrder);
        } catch (err) {
            res.status(404).end();
        }
    }

 /*   async modifyInternalOrderById(req, res) {
        const id = req.params.id;
        const data = req.body;
        if (id == undefined || id == '') {
            return res.status(422).json({ error: `Invalid id` });
        }
        try {
            const internalOrder = await db.modifyStateInternalOrderById(data.newState, id);
            if(data.newState === 'COMPLETED') {
                db.storeSkuIO(data.products, id);
            }
            res.status(200).json(internalOrder);
        } catch (err) {
            res.status(404).end();
        }
    } */

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
