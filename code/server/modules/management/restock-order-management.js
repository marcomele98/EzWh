"use strict"

const dayjs = require('dayjs');
const db = require('../database/restockOrderDAO');

class RestockOrderManagement {

    constructor() { }
    async createNewRestockOrder(req, res) {
        let restockOrder = req.body;
        if (restockOrder === undefined || restockOrder.issueDate === undefined || restockOrder.products === undefined || restockOrder.supplierId === undefined
            || restockOrder == '' || restockOrder.issueDate === '' || restockOrder.products === '' || restockOrder.supplierId === "" || restockOrder.supplierId == 0
            || isNaN(restockOrder.supplierId) || dayjs(restockOrder.issueDate, 'YYYY-MM-DD HH:mm', true).isValid() !== true) {
            return res.status(422).end();
        }
        try {
            await db.storeRestockOrder(restockOrder);
            const RE = await db.getLastId();
            db.storeProducts(restockOrder.products, RE["MAX(id)"]);
            return res.status(201).end();
        }
        catch (err) {
            return res.status(503).end();
        }
    }

    async getListRestockOrder(req, res) {
        try {
            const listRestockOrders = await db.getListRestockOrders();
            for (var i = 0; i < listRestockOrders.length; i++) {
                const products = await db.getListProducts(listRestockOrders[i].id);
                listRestockOrders[i].products = products;

                if (listRestockOrders[i].state == 'ISSUED') {
                    listRestockOrders[i].transportNote = '';
                    listRestockOrders[i].skuReturnItems = '';
                }
                else if (listRestockOrders[i].state == 'DELIVERY') {
                    listRestockOrders[i].skuReturnItems = '';
                }

            }
            res.status(200).json(listRestockOrders);
        } catch (err) {
            res.status(500).end();
        }
    }

    async getListIssuedRestockOrders(req, res) {
        try {
            const listRestockOrders = await db.getListIssuedRestockOrders();
            for (var i = 0; i < listRestockOrders.length; i++) {
                const products = await db.getListProducts(listRestockOrders[i].id);
                listRestockOrders[i].products = products;
                listRestockOrders[i].transportNote = '';
                listRestockOrders[i].skuReturnItems = '';
            }
            res.status(200).json(listRestockOrders);
        } catch (err) {
            res.status(404).end();
        }
    }

    async getRestockOrderById(req, res) {
        const id = req.params.id;
        if (id == undefined || id == '' || isNaN(id)) {
            return res.status(422).end();
        }
        try {
            const restockOrder = await db.getRestockOrderById(id);
            if (restockOrder == undefined) {
                return res.status(404).end();
            }
            if (restockOrder.state == 'ISSUED') {
                restockOrder.skuReturnItems = '';
                restockOrder.transportNote = '';

            } else if (restockOrder.state == 'DELIVERY') {
                restockOrder.skuReturnItems = '';
            }
            const products = await db.getListProducts(id);
            restockOrder.products = products;

            return res.status(200).json(restockOrder);
        } catch (err) {
            res.status(500).end();
        }
    }

    async getListSKUItemsToReturn(req, res) {
        const id = req.params.id;
        if (id == undefined || id == '' || isNaN(id)) {
            return res.status(422).end();
        }
        try {
            const SkuReturn = await db.getListSKURET(id);
            const restockOrder = await db.getRestockOrderById(id);
            if (restockOrder.state != 'COMPLETEDRETURN') {
                return res.status(422).end();
            }
            if (restockOrder == undefined) {
                return res.status(404).end();
            }
            return res.status(200).json(SkuReturn);
        } catch (err) {
            res.status(500).end();
        }
    }

    async modifyStateRestockOrderById(req, res) {
        const id = req.params.id;
        const data = req.body;
        if (id == undefined || id == '' || isNaN(id)) {
            return res.status(422).end();
        }
        const RE = await db.getRestockOrderById(id);
        if (RE != undefined) {
            try {
                const restockOrder = await db.modifyStateRestockOrderOrderById(data, id);
                return res.status(200).json(restockOrder);
            } catch (err) {
                res.status(503).end();
            }
        } else {
            return res.status(404).end();
        }
    }

    async addSKUItemsToRestockOrder(req, res) {
        const id = req.params.id;
        const data = req.body;
        if (id == undefined || id == '' || isNaN(id)) {
            return res.status(422).end();
        }
        const RE = await db.getRestockOrderById(id);
        if (RE != undefined) {
            try {
                const products = await db.storeProducts(data, id);
                return res.status(200).json(products);
            } catch (err) {
                res.status(503).end();
            }
        } else {
            return res.status(404).end();
        }
    }

    async addTransportNoteToRestockOrder(req, res) {
        const id = req.params.id;
        const data = req.body;
        if (id == undefined || id == '' || isNaN(id)) {
            return res.status(422).end();
        }
        const RE = await db.getRestockOrderById(id);
        if (RE != undefined) {
            try {
                const transportNote = await db.storeTransportNote(data, id);
                return res.status(200).json(transportNote);
            } catch (err) {
                res.status(503).end();
            }
        } else {
            return res.status(404).end();
        }
    }

    async deleteRestockOrderById(req, res) {
        const id = req.params.id;
        if (id == undefined || id == '' || isNaN(id)) {
            return res.status(422).end();
        }
        try {
            db.deleteRestockOrderById(id);
            res.status(204).end();
        } catch (err) {
            res.status(500).end();
        }
    }



}

module.exports = RestockOrderManagement;