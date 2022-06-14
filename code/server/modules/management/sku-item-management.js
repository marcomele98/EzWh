'use strict'

const db = require('../database/skuItemDAO');
const SKUdb = require('../database/skuDAO');
const dayjs = require('dayjs')


class SkuItemManagement {
    constructor() { }


    async getSkuItemList(req, res) {
        try {
            const skuItemList = await db.getSkuItemList();
            res.status(200).json(skuItemList);
        } catch (err) {
            res.status(500).end();
        }
    }

    async getSkuItemBySkuId(req, res) {
        const skuId = req.params.id;
        if (skuId == null || skuId === undefined || skuId === '' || skuId < 0 || isNaN(skuId)) {
            return res.status(422).json({ error: 'Invalid SkuID' });
        }
        const sku = await SKUdb.getSkuById(skuId);
        if (sku == undefined) {
            return res.status(404).end();
        }
        try {
            const skuItem = await db.getSkuItemBySkuId(skuId);
            return res.status(200).json(skuItem);
        } catch (err) {
            return res.status(500).end();
        }
    }


    async getSkuItemByRfid(req, res) {
        const rfid = req.params.rfid;
        if (rfid == undefined || rfid == '' || rfid == 0 || rfid.length !== 32 || isNaN(rfid)) {
            return res.status(422).end();
        }
        try {
            const skuItem = await db.getSkuItemByRfid(rfid);
            if (skuItem === undefined) {
                return res.status(404).end();
            } else {
                return res.status(200).json(skuItem);
            }
        }
        catch (err) {
            return res.status(500).end();
        }
    }

    async addSkuItem(req, res) {
        let skuItem = req.body;

        if (skuItem.RFID.length !== 32 || skuItem.RFID === '' || skuItem.RFID == 0 || skuItem.RFID == undefined || isNaN(skuItem.RFID) ||
            skuItem.SKUId === '' || skuItem.SKUId == undefined || skuItem.SKUId < 0 || isNaN(skuItem.SKUId) ||
            skuItem.DateOfStock == undefined || skuItem.DateOfStock == '' ||
            !dayjs(skuItem.DateOfStock).isValid()) {
            return res.status(422).json({ error: `Invalid skuItem data` });
        }
        const sku = await SKUdb.getSkuById(skuItem.SKUId);
        if (sku == undefined) {
            return res.status(404).end();
        }
        try {
            await db.storeSkuItem(skuItem);
            return res.status(201).end();
        } catch (err) {
            res.status(503).end();
        }
    }

    async editInfoSkuItem(req, res) {
        const rfid = req.params.rfid;
        const data = req.body;

        if (rfid.length !== 32 || rfid == '' || isNaN(rfid)) {
            return res.status(422).end();
        }

        const oldSkuItem = await db.getSkuItemByRfid(rfid);

        if (oldSkuItem == undefined) {
            res.status(404).end()
        }
        if (data.newRFID == undefined) {
            data.newRFID = oldSkuItem.RFID;
        }
        if (data.newAvailable == undefined) {
            data.newAvailable = oldSkuItem.Available;
        }
        if (data.newDateOfStock == undefined) {
            data.newDateOfStock = oldSkuItem.DateOfStock;
        }

        if ( data.length == 0 || data.newRFID.length !== 32 || data.newRFID === '' ||
            data.newAvailable === '' || isNaN(data.newRFID) || data.newDateOfStock === '' ||
            !dayjs(data.newDateOfStock).isValid()) {
            return res.status(422).end();
        }
        if (data.newAvailable !== 1 && data.newAvailable !== 0) {
            return res.status(422).end();
        }

        try {
            await db.editInfoSkuItem(rfid, data);
            res.status(200).end();
        } catch (err) {
            res.status(503).end();
        }

    }

    async deleteSkuItemById(req, res) {
        const id = req.params.rfid;
        if (id == undefined || id == '' || id == 0 || isNaN(id) || id.length != 32) {
            res.status(422).end();
        }
        try {
            await db.deleteSkuItemByRfid(id);
            res.status(204).end();
        } catch (err) {
            res.status(500).end();
        }
    }
}

module.exports = SkuItemManagement;