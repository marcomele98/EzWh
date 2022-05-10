'use strict'

const db = require('../database/skuItemDAO');
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
        if (skuId === undefined || skuId === '' || skuId == 0 || isNaN(skuId)) {
            return res.status(422).json({ error: 'Invalid SkuID' });
        }
        const id = parseInt(skuId, 10);
        try {
            const skuItem = await db.getSkuItemBySkuId(id);
            if (skuItem === undefined) {
                return res.status(404).end();
            } else {
                return res.status(200).json(skuItem);
            }
        } catch (err) {
            return res.status(500).end();
        }
    }


    async getSkuItemByRfid(req, res) {
        const rfid = req.params.rfid;
    if (rfid == undefined || rfid == '' || rfid == 0 || rfid.length !== 32 || isNaN(rfid)) {
            return res.status(422).json({ error: 'Invalid id' });
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
        if (Object.keys(req.body).length === 0) {
            return res.status(404).json({ error: `Empty body request` });
        }
        let skuItem = req.body;
        if (skuItem.RFID.length !== 32 || skuItem.RFID === '' || skuItem.RFID == 0 || skuItem.RFID == undefined || isNaN(skuItem.RFID) ||
            skuItem.SKUId=== '' || skuItem.SKUId == undefined || skuItem.SKUId == 0 || isNaN(skuItem.SKUId) ||  
            skuItem.DateOfStock == undefined || skuItem.DateOfStock == '' ||
             dayjs(skuItem.DateOfStock, 'YYYY-MM-DD HH:mm', true).isValid() !== true ) {
            return res.status(422).json({ error: `Invalid skuItemitem data` });
        }
        try {
            await db.newTableSkuItem();
            db.storeSkuItem(skuItem);
            //db.dropTable();
            return res.status(201).end();
        } catch (err) {
            res.status(503).end();
        }
    }

    async editInfoSkuItem(req, res) {
        const rfid = req.params.rfid;
        const data = req.body;
        if (data.length == 0 || data.newRFID.length !== 32 || data.newRFID == '' || data.newRFID ==undefined ||
         data.newAvailable == undefined || data.newAvailable === '' || data.newAvailable.length !== 1 || 
        data.newDateOfStock == undefined || data.newDateOfStock == '' || dayjs(skuItem.DateOfStock, 'YYYY-MM-DD HH-MM', true).isValid() !== true)  {
            return res.status(422).end();
        }
        
        const skuItem = await db.getSkuItemByRfid(rfid);
        if (skuItem !== undefined) {
            try {
                await db.editInfoSkuItem(rfid, data);
                res.status(200).end();
            } catch (err) {
                res.status(404).end();
            }
        } else {
            res.status(404).end()
        }
    }

    deleteSkuItemById(req, res) {
        try {
            db.deleteSkuItemByRfid(req.params.rfid);
            res.status(204).end();
        } catch (err) {
            res.status(500).end();
        }
    }
}

module.exports = SkuItemManagement;