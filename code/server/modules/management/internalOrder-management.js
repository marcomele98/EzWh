"use strict"
const dayjs = require('dayjs')
const db = require('../database/internalOrderDAO');
//const dbSKU = require('../database/skuDAO');

const possibleType = ['ISSUED', 'ACCEPTED', 'REFUSED', 'CANCELED', 'COMPLETED'];

var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat);

class InternalOrderManagement {

    constructor() { }

    async createNewInternalOrder(req, res) {
        let internalOrder = req.body;
        if (internalOrder === undefined || internalOrder.issueDate === undefined || internalOrder.products === undefined || internalOrder.customerId === undefined
            || internalOrder == '' || internalOrder.issueDate === '' || internalOrder.products === '' || internalOrder.customerId === "" || internalOrder.customerId <= 0
            || isNaN(internalOrder.customerId) || !dayjs(internalOrder.issueDate, ['YYYY/MM/DD', 'YYYY/MM/DD hh:mm', 'YYYY/M/DD', 'YYYY/M/DD hh:mm', 'YYYY/MM/D', 'YYYY/MM/D hh:mm', 'YYYY/M/D', 'YYYY/M/D hh:mm'], true).isValid()) {
            return res.status(422).end();
        }
        for (var i = 0; i < internalOrder.products.length; i++) {
            // const sku = await dbSKU.getSkuById(internalOrder.products[i].SKUId);
            // if(sku == undefined) {
            //     return res.status(404).end();
            // }
            if (internalOrder.products[i].SKUId == undefined || internalOrder.products[i].SKUId <= 0 || internalOrder.products[i].SKUId == '' || isNaN(internalOrder.products[i].SKUId)
                || !isNaN(internalOrder.products[i].description) || internalOrder.products[i].description == undefined || internalOrder.products[i].description == '' || internalOrder.products[i].price <= 0 ||
                internalOrder.products[i].price == undefined || internalOrder.products[i].price == '' || isNaN(internalOrder.products[i].price) ||
                internalOrder.products[i].qty == undefined || internalOrder.products[i].qty <= 0 || internalOrder.products[i].qty == '' || isNaN(internalOrder.products[i].qty)
            ) {
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
                    const skuItems = await db.getListSKU(listInternalOrders[i].id);
                    const products = await db.getListProducts(listInternalOrders[i].id);
                    for (var e = 0; e < skuItems.length; e++) {
                        for (var b = 0; b < products.length; b++) {
                            if (skuItems[e].SKUId == products[b].SKUId) {
                                skuItems[e] = {
                                    "SKUId": skuItems[e].SKUId,
                                    "description": products[b].description,
                                    "price": products[b].price,
                                    "RFID": skuItems[e].RFID
                                }
                            }
                        }
                    }
                    listInternalOrders[i].products = skuItems;
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
            res.status(500).end();
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
            res.status(500).end();
        }
    }

    async getInternalOrderById(req, res) {
        const id = req.params.id;
        if (id == undefined || id == '' || isNaN(id) || id <= 0) {
            return res.status(422).end();
        }
        try {
            const internalOrder = await db.getInternalOrderById(id);
            if (internalOrder === undefined) {
                return res.status(404).end();
            }
            if (internalOrder.state == 'COMPLETED') {
                const skuItems = await db.getListSKU(id);
                const products = await db.getListProducts(id);
                for (var e = 0; e < skuItems.length; e++) {
                    for (var b = 0; b < products.length; b++) {
                        if (skuItems[e].SKUId == products[b].SKUId) {
                            skuItems[e] = {
                                SKUId: skuItems[e].SKUId,
                                description: products[b].description,
                                price: products[b].price,
                                RFID: skuItems[e].RFID
                            }
                        }
                    }
                }
                internalOrder.products = skuItems;
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
        if (id == undefined || id == '' || isNaN(id) || id <= 0 || !possibleType.includes(data.newState)) {
            return res.status(422).end();
        }
        const IO = await db.getInternalOrderById(id);

        if (IO !== undefined) {
            try {
                if (data.newState === 'COMPLETED') {
                    for (var i = 0; i < data.products.length; i++) {
                        if (data.products[i].SkuID == undefined || data.products[i].SkuID <= 0 || data.products[i].SkuID == '' || isNaN(data.products[i].SkuID)
                            || data.products[i].RFID == undefined || data.products[i].RFID == '' || data.products[i].RFID.length != 32 || isNaN(data.products[i].RFID)) {
                            return res.status(422).end();
                        }
                    }
                    await db.storeSkuIO(data.products, id);
                }

                await db.modifyStateInternalOrderById(data, id);
                return res.status(200).end();
            } catch (err) {
                res.status(503).end();
            }
        } else {
            return res.status(404).end();
        }
    }


    async deleteInternalOrderById(req, res) {
        const id = req.params.id;
        if (id == undefined || id == '' || isNaN(id) || id <= 0) {
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