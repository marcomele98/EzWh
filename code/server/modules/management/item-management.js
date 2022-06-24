"use strict"

const db = require('../database/itemDAO');
const dbSKU = require('../database/skuDAO')

class ItemManagement {

    constructor() { }

    async createNewItem(req, res) {
        let item = req.body;
        const skuSupp = await db.getSkuBySupplier(req.body.SKUId, req.body.supplierId);

        if ( skuSupp != undefined || item.description == undefined || item.description == '' || !isNaN(item.description) 
        || item.price < 0 || item.price == undefined || isNaN(item.price) 
        || item.supplierId == undefined || isNaN(item.supplierId) || item.supplierId < 0
        || item.id == undefined || item.id < 0  || isNaN(item.id)
        || item.SKUId < 0 || isNaN(item.SKUId) ||  item.SKUId == undefined) {
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
        const suppId = req.params.supplierId
        if (id == undefined || id < 0 || isNaN(id)) {
            return res.status(422).end();
        }
        try {
            const item = await db.getItemById(id, suppId);
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
        const suppId = req.params.supplierId
        const data = req.body;

        if (id == undefined || isNaN(id) || id < 0 || data == undefined || data == '' || data == null || suppId == undefined || isNaN(suppId) || suppId < 0) {
                return res.status(422).end();
        }

        const it = await db.getItemById(id, suppId);

        if (it == undefined) {
            res.status(404).end();
        }

        if (data.newDescription == undefined || data.newPrice == null) {
            data.newDescription = it.description;
        }

        if (data.newPrice == undefined || data.newPrice == null) {
            data.newPrice = it.price;
        }

        try {
            await db.modifyItemById(id, data, suppId);
            res.status(200).end();
        } catch (err) {
            res.status(503).end();
        }
    }

    async deleteItemById(req, res) {
        const id = req.params.id;
        const suppId = req.params.supplierId
        if (id == undefined || isNaN(id) || id < 0 || suppId == undefined || isNaN(suppId) || suppId < 0) {
            return res.status(422).end();
        }
        try {
            await db.deleteItemById(id, suppId);
            res.status(204).end();
        } catch (err) {
            res.status(503).end();
        }
    }
}


module.exports = ItemManagement;
