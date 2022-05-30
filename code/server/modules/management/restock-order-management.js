"use strict"

const dayjs = require('dayjs');
const db = require('../database/restockOrderDAO');
const dbRES = require('../database/test-resultDAO');


const possibleType = ['ISSUED', 'DELIVERY', 'DELIVERED', 'TESTED', 'COMPLETEDRETURN', 'COMPLETED'];

class RestockOrderManagement {

    constructor() { }

    async createNewRestockOrder(req, res) {
        let restockOrder = req.body;
        if (restockOrder === undefined ||
            restockOrder.issueDate === undefined ||
            restockOrder.products === undefined ||
            restockOrder.supplierId === undefined ||
            restockOrder == '' ||
            restockOrder.issueDate === '' ||
            restockOrder.products === '' ||
            restockOrder.supplierId < 0 ||
            isNaN(restockOrder.supplierId) ||
            !dayjs(restockOrder.issueDate).isValid()) {
            return res.status(422).end();
        }
        for (var i = 0; i < restockOrder.products.length; i++) {
            if (
                restockOrder.products[i].SKUId == undefined || restockOrder.products[i].SKUId <= 0 || restockOrder.products[i].SKUId == '' || isNaN(restockOrder.products[i].SKUId) ||
                !isNaN(restockOrder.products[i].description) || restockOrder.products[i].description == undefined || restockOrder.products[i].description == '' || restockOrder.products[i].price < 0 ||
                restockOrder.products[i].price == undefined || restockOrder.products[i].price == '' || isNaN(restockOrder.products[i].price) || restockOrder.products[i].qty == undefined ||
                restockOrder.products[i].qty < 0 || isNaN(restockOrder.products[i].qty)
            ) {
                return res.status(422).end();
            }
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
                    listRestockOrders[i] = {
                        "id": listRestockOrders[i].id,
                        "issueDate": listRestockOrders[i].issueDate,
                        "state": listRestockOrders[i].state,
                        "products": products,
                        "supplierId": listRestockOrders[i].supplierId,
                        "skuItems": []
                    }
                }

                const trasp = await db.getTransportNote(listRestockOrders[i].id)

                if (listRestockOrders[i].state == 'DELIVERY') {
                    listRestockOrders[i] = {
                        "id": listRestockOrders[i].id,
                        "issueDate": listRestockOrders[i].issueDate,
                        "state": listRestockOrders[i].state,
                        "products": products,
                        "supplierId": listRestockOrders[i].supplierId,
                        "transportNote": trasp,
                        "skuItems": []
                    }
                }
                else {
                    const SKUItems = await db.getListSKURE(listRestockOrders[i].id);
                    
                    listRestockOrders[i].skuItems = SKUItems;
                    listRestockOrders[i].transportNote = trasp;
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
                listRestockOrders[i] = {
                    "id": listRestockOrders[i].id,
                    "issueDate": listRestockOrders[i].issueDate,
                    "state": listRestockOrders[i].state,
                    "products": products,
                    "supplierId": listRestockOrders[i].supplierId,
                    "skuItems": []
                }
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
            var restockOrder = await db.getRestockOrderById(id);
            const products = await db.getListProducts(id);
            if (restockOrder == undefined) {
                return res.status(404).end();
            }
            if (restockOrder.state == 'ISSUED') {
                restockOrder = {
                    "issueDate": restockOrder.issueDate,
                    "state": restockOrder.state,
                    "products": products,
                    "supplierId": restockOrder.supplierId,
                    "skuItems": []
                }

            } else if (restockOrder.state == 'DELIVERY') {
                const trasp = await db.getTransportNote(listRestockOrders[i].id)
                restockOrder = {
                    "issueDate": restockOrder.issueDate,
                    "state": restockOrder.state,
                    "products": products,
                    "supplierId": restockOrder.supplierId,
                    "transportNote": trasp,
                    "skuItems": []
                }
            }
            else {
                const SKUItems = await db.getListSKURE(restockOrder.id);
                const trasp = await db.getTransportNote(restockOrder.id)
                restockOrder.products = products;
                restockOrder.transportNote = trasp;
                restockOrder.skuItems = SKUItems;
            }
            return res.status(200).json(restockOrder);
        } catch (err) {
            res.status(500).end();
        }
    }

    async getListSKUItemsToReturn(req, res) {
        const id = req.params.id;
        if (id == undefined || id == '' || isNaN(id) || id <= 0) {
            return res.status(422).end();
        }
        try {
            const restockOrder = await db.getRestockOrderById(id);
            if (restockOrder == undefined || restockOrder.state != 'COMPLETEDRETURN') {
                return res.status(404).end();
            }
            const SKUItems = await db.getListSKURE(id);
            var count = 0;
            const SKUItemsReturn = [];

            for (var i = 0; i < SKUItems.length; i++) {
                const SKUcheck = await dbRES.getPassByIds(SKUItems[i].id, SKUItems[i].rfid);
                if (SKUcheck === undefined) {
                    SKUItemsReturn[count] = SKUItems[i];
                    count++;
                }
            }
            return res.status(200).json(SKUItemsReturn);
        } catch (err) {
            res.status(500).end();
        }
    }

    async modifyStateRestockOrderById(req, res) {
        const id = req.params.id;
        const data = req.body;
        if (data.newState == null || id == undefined || id == '' || isNaN(id)|| id < 0 || !possibleType.includes(data.newState)) {
            return res.status(422).end();
        }
        const RE = await db.getRestockOrderById(id);
        if (RE != undefined) {
            try {
                await db.modifyStateRestockOrderById(data, id);
                return res.status(200).end();
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

        if (data.skuItems == null || id == undefined || id == '' || isNaN(id) || id < 0) {
            return res.status(422).end();
        }

        const RE = await db.getRestockOrderById(id);
        if(RE == undefined) {
            return res.status(404).end();
        }

        for(var i = 0; i < data.skuItems.length; i++){
            if(data.skuItems[i].rfid.length != 32 || data.skuItems[i].rfid === '' || data.skuItems[i].rfid == undefined || isNaN(data.skuItems[i].rfid)
             || data.skuItems[i].SKUId == undefined || data.skuItems[i].SKUId == '' || data.skuItems[i].SKUId < 0 || isNaN(data.skuItems[i].SKUId)) {
                return res.status(422).end();
            }
        }
        
        if (RE.state != 'DELIVERED') {
            return res.status(422).end();
        }
        try {
            await db.storeSkuRE(data, id);
            return res.status(200).end();
        } catch (err) {
            res.status(503).end();
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
                if (!dayjs(data.transportNote.deliveryDate, ['YYYY/MM/DD', 'YYYY/MM/DD hh:mm', 'YYYY/M/DD', 'YYYY/M/DD hh:mm', 'YYYY/MM/D', 'YYYY/MM/D hh:mm', 'YYYY/M/D', 'YYYY/M/D hh:mm'], true).isValid() ||
                    dayjs(RE.issueDate).isAfter(data.transportNote.deliveryDate)
                    || RE.state != 'DELIVERY') {
                    return res.status(422).end();
                }
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
        if (id == undefined || id == '' || isNaN(id) || id <= 0) {
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