"use strict"

const db = require('../database/itemDAO');

class ItemManagement {

    constructor() { }

    async createNewItem(req, res) {
        let item = req.body;
        const skuSupp = await db.getSkuBySupplier(req.body.SKUId, req.body.supplierId)
        if (skuSupp.length !== 0 || item.length === 0 || item.id == 0 || item.description === '' || item.price == 0 || item.skuId == 0 || item.supplierId == 0) {
            return res.status(422).end();
        }
//        const sku = await db.getSkuById(req.body.SKUId);
//        if (sku.length === 0){
//            return res.status(404).end();
 //       }
        try {
            await db.newTableItem();
            db.storeItem(item);
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
        if (id == undefined || id == '' || id == 0) {
            return res.status(422).end();
        }
        const item = await db.getItemById(id);
        if(item.length === 0) {
            return res.status(404).end();
        } else if (item.length !== 0) {
            return res.status(200).json(item);
        } 
        return res.status(500).end();
    }

    async modifyItemById(req, res) {
        const id = req.params.id;
        const data = req.body;
        if (data.length == 0 || data.newDescription == '' || data.newPrice == 0) {
            return res.status(422).end();
        }
        const item = await db.getItemById(id);
        if( item.length !== 0 ) {
            try{
                await db.modifyItemById(id, data);
                res.status(200).end();
            } catch(err) {
                res.status(503).end();
            }
        } else {
            res.status(404).end();
        }
    }

    deleteItemById(req, res) {
        const id = req.params.id;
        if (id == undefined || id == '' || id == 0) {
            return res.status(422).end();
        }
        try {
            db.deleteItemById(req.params.id);
            res.status(204).end();
        } catch (err) {
            res.status(503).end();
        }
    }
}



module.exports = ItemManagement;
