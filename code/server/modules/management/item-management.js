"use strict"

const db = require('../database/itemDAO');
const dbSKU = require('../database/skuDAO')

class ItemManagement {

    constructor() { }

    async createNewItem(req, res) {
        let item = req.body;
        const skuSupp = await db.getSkuBySupplier(req.body.SKUId, req.body.supplierId);
        if (skuSupp != undefined || item == '' || item == undefined || item.description == undefined || item.description === '' || !isNaN(item.description)
            || item.price <= 0 || item.price == undefined || isNaN(item.price) || item.price == '' || item.supplierId <= 0
            || item.supplierId == undefined || item.supplierId == '' || isNaN(item.supplierId) || item.id <= 0 || item.id == undefined
            || item.id == '' || isNaN(item.id) || item.SKUId <= 0 || isNaN(item.SKUId) || item.SKUId == '' || item.SKUId == undefined) {
            return res.status(422).end();
        }
        const sku = await dbSKU.getSkuById(item.SKUId);
        if (sku === undefined) {
            return res.status(404).end();
        }
        try {
            await db.storeItem(item);
            res.status(201).end();
        } catch (err) {
            res.status(503).end();
        }
    }

    async getListItems(req, res) {
        try {
            const listItem = await db.getListItems();
            res.status(200).json(listItem);
        } catch (err) {
            res.status(500).end();
        }
    }

    async getItemById(req, res) {
        const id = req.params.id;
        if (id == undefined || id == '' || id == 0 || isNaN(id)) {
            return res.status(422).end();
        }
        try {
            const item = await db.getItemById(id);
            if (item === undefined) {
                return res.status(404).end();
            } else {
                return res.status(200).json(item);
            }
        }
        catch (err) {
            return res.status(500).end();
        }
    }

    async modifyItemById(req, res) {
        const id = req.params.id;
        const data = req.body;
        const item = await db.getItemById(id);

        if (data.newDescription == undefined) {
            data.newDescription = item.description;
        }
        if (data.newPrice == undefined) {
            data.newPrice = item.price;
        }
        if (data.length == 0 || data == undefined || data.newDescription == undefined || data.newDescription == ''
            || !isNaN(data.newDescription) || data.newPrice <= 0 || isNaN(data.newPrice) || data.newPrice == undefined || data.newPrice == '') {
            return res.status(422).end();
        }
        if (item !== undefined) {
            try {
                await db.modifyItemById(id, data);
                res.status(200).end();
            } catch (err) {
                res.status(503).end();
            }
        } else {
            res.status(404).end();
        }
    }

    async deleteItemById(req, res) {
        const id = req.params.id;
        if (id == undefined || id == '' || id == 0 || isNaN(id)) {
            return res.status(422).end();
        }
        const item = await db.getItemById(id);
        if (item === undefined) {
            return res.status(404).end();
        }
        try {
            await db.deleteItemById(req.params.id);
            res.status(204).end();
        } catch (err) {
            res.status(503).end();
        }
    }
}


module.exports = ItemManagement;
