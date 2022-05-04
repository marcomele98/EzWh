"use strict"
const DAO = require('../DAO');
const db = new DAO('database');
class ItemManagement {

    constructor() { }

    async createNewItem(req, res) {
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({ error: `Empty body request` });
        }
        let item = req.body;
        if (item.description === '' || item.price == 0 || item.skuId == '' || item.supplierId == '') {
            return res.status(422).json({ error: `Invalid item data` });
        }
        await db.newTableItem();
        db.storeItem(item);
        return res.status(201).end();
    }

    async getListItems(req, res) {
        try {
            const listItem = await db.getListItems();
            res.status(200).json(listItem);
        } catch (err) {
            res.status(404).end();
        }
    }

    async getItemById(req, res) {
        const id = req.params.id;
        if (id == undefined || id == '') {
            return res.status(422).json({ error: `Invalid id` });
        }
        const integerID = parseInt(id, 10);
        try {
            const item = await db.getItemById(integerID);
            res.status(200).json(item);
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

    deleteItemById(req, res) {
        try {
            db.deleteItemById(req.params.id);
            res.status(204).end();
        } catch (err) {
            res.status(500).end();
        }
    }
}



module.exports = ItemManagement;
