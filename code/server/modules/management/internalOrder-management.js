"use strict"
const dayjs = require('dayjs')
const db = require('../database/internalOrderDAO');
const { getSkuById } = require('../database/skuDAO');
const dbSKU = require('../database/skuItemDAO')

class InternalOrderManagement {

    constructor() { }

    async createNewInternalOrder(req, res) {
        let internalOrder = req.body;
        if (internalOrder === undefined || internalOrder.issueDate === undefined || internalOrder.products === undefined || internalOrder.customerId === undefined
            || internalOrder == '' || internalOrder.issueDate === '' || internalOrder.products === '' || internalOrder.customerId === "" || internalOrder.customerId == 0
            || isNaN(internalOrder.customerId) || dayjs(internalOrder.issueDate, 'YYYY-MM-DD HH:mm', true).isValid() !== true) {
            return res.status(422).end();
        }
        for (var i = 0; i < internalOrder.products.length; i++){
            const sku = getSkuById(internalOrder.products[i].SKUId);
            if(internalOrder.products[i].SKUId == undefined || internalOrder.products[i].SKUId <= 0 || internalOrder.products[i].SKUId == '' || isNaN(internalOrder.products.SKUId)
            || internalOrder.products[i].description == undefined || internalOrder.products[i].description == '' || internalOrder.products[i].price <= 0 || 
            internalOrder.products[i].price == undefined || internalOrder.products[i].price == '' || isNaN(internalOrder.products.price) || 
            internalOrder.products[i].qty == undefined || internalOrder.products[i].qty <= 0 || internalOrder.products[i].qty == '' || isNaN(internalOrder.products[i].qty)
            || internalOrder.products[i].qty > sku.qty) {
                return res.status(422).end();
            }
            
        }
        try {
            await db.storeInternalOrder(internalOrder);
            const IO = await db.getLastId();
            db.storeProducts(internalOrder.products, IO["MAX(id)"]);
            return res.status(201).end();
        }
        catch (err) {
            return res.status(503).end();
        }
    }

    async getListInternalOrders(req, res) {
        try {
            const listInternalOrders = await db.getListInternalOrders();
            for (var i = 0; i < listInternalOrders.length; i++) {
                if (listInternalOrders[i].state == 'COMPLETED') {
                    const products = await db.getListSKU(listInternalOrders[i].id);
                    listInternalOrders[i].products = products;
                } else {
                    const products = await db.getListProducts(listInternalOrders[i].id);
                    listInternalOrders[i].products = products;
                }
            }
            res.status(200).json(listInternalOrders);
        } catch (err) {
            res.status(500).end();
        }
    }

    async getListIssuedInternalOrders(req, res) {
        try {
            const listInternalOrders = await db.getListIssuedInternalOrders();
            for (var i = 0; i < listInternalOrders.length; i++) {
                const products = await db.getListProducts(listInternalOrders[i].id);
                listInternalOrders[i].products = products;
            }
            res.status(200).json(listInternalOrders);
        } catch (err) {
            res.status(404).end();
        }
    }

    async getListAcceptedInternalOrders(req, res) {
        try {
            const listInternalOrders = await db.getListAcceptedInternalOrders();
            for (var i = 0; i < listInternalOrders.length; i++) {
                const products = await db.getListProducts(listInternalOrders[i].id);
                listInternalOrders[i].products = products;
            }
            res.status(200).json(listInternalOrders);
        } catch (err) {
            res.status(404).end();
        }
    }

    async getInternalOrderById(req, res) {
        const id = req.params.id;
        if (id == undefined || id == '' || isNaN(id)) {
            return res.status(422).end();
        }
        try {
            const internalOrder = await db.getInternalOrderById(id);
            if (internalOrder === undefined) {
                return res.status(404).end();
            }
            if (internalOrder.state == 'COMPLETED') {
                const products = await db.getListSKU(id);
                internalOrder.products = products;
            } else {
                const products = await db.getListProducts(id);
                internalOrder.products = products;
            }
            return res.status(200).json(internalOrder);
        } catch (err) {
            res.status(500).end();
        }
    }

    async modifyInternalOrderById(req, res) {
        const id = req.params.id;
        const data = req.body;
        if (id == undefined || id == '' || isNaN(id)) {
            return res.status(422).end();
        }
        const IO = await db.getInternalOrderById(id);
        if (IO !== undefined) {
            try {
                if (data.newState === 'COMPLETED') {
                    for (var i = 0; i < internalOrder.products.length; i++){
                        if(data.products[i].SKUId == undefined || data.products[i].SKUId <= 0 || data.products[i].SKUId == '' || isNaN(data.products.SKUId)
                        || data.products[i].RFID == undefined || data.products[i].RFID == '' || data.products[i].RFID.length != 32) {
                            return res.status(422).end();
                        }
                        dbSKU.setAvailable(data.products[i].RFID, 0);
                    }
                    db.storeSkuIO(data.products, id);
                }
                const internalOrder = await db.modifyStateInternalOrderById(data, id);
                return res.status(200).json(internalOrder);
            } catch (err) {
                res.status(503).end();
            }
        } else {
            return res.status(404).end();
        }
    }


    async deleteInternalOrderById(req, res) {
        const id = req.params.id;
        if (id == undefined || id == '' || isNaN(id)) {
            return res.status(422).end();
        }
        const internalOrder = await db.getInternalOrderById(id);
        if (internalOrder === undefined) {
            return res.status(404).end();
        }
        try {
            db.deleteInternalOrderById(id);
            res.status(204).end();
        } catch (err) {
            res.status(500).end();
        }
    }
}

module.exports = InternalOrderManagement;