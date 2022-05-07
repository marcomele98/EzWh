"use strict"

const { get } = require('express/lib/response');
const db = require('../database/skuDAO');

class SkuManagement {
    constructor() {
    }

    async getSkuList(req, res) {
        try {
            const skuList = await db.getSkuList();
            res.status(200).json(skuList);
        } catch (err) {
            res.status(501).end();
        }
    }

    async getSkuById(req, res) {
        const id = req.params.id;

        if (id === undefined || id === '' || id == 0) {
            return res.status(442).json({ error: 'Invalid id' });
        }
        try {
            const sku = await db.getSkuById(id);

            if (sku === undefined) {
                return res.status(404).end();
            } else if (sku.length !== 0) {
                return res.status(200).json(sku);
            }
        } catch (err) {
            return res.status(500).end();
        }
    }

    async addSku(req, res) {
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({ error: `Empty body request` });
        }
        let sku = req.body;
        if (sku.description === '' || sku.price == 0 || sku.weigth == 0 || sku.volume == 0 || sku.notes === '' || sku.availableQuantity == 0) {
            return res.status(422).json({ error: `Invalid item data` });
        }
        try {
            await db.newTableSku();
            db.addSku(sku);
            return res.status(201).end();

        } catch (err) {
            res.status(503).end();
        }
    }


    async updateSkuInfo(req, res) {
        const id = req.params.id;
        const data = req.body;
        if (id == undefined || id == '' || data.length == 0) {
            return res.status(422).json({ error: `Invalid id` });
        }
        const sku = await db.getSkuById(id);
        if (sku !== undefined) {
            try {
                await db.updateSkuInfo(id, data);
                res.status(200).end();
            } catch (err) {
                res.status(503).end();
            }
        } else { res.status(404).end() }
    }

    async updateSkuPosition(req, res) {
        const id = req.params.id;
        const position = req.body;
        if (id == undefined || id == '' || id == 0 || position == undefined || position == 0 || position == '') {
            return res.status(422).json({ error: 'Invalid id ' });
        }
        const sku = await db.getSkuById(id);
        if (sku !== undefined) {
            try {
                await db.setPosition(id, position);
                //await db.updatePosition(sku.id, sku.WEIGHT, sku.VOLUME, sku.POSITIONID);
                res.status(200).end();
            } catch (err) {
                res.status(503).end();
            }
        } else {
            res.status(404).end()
        }
    }

    async updateQuantity() {
        //takes as params the id of the sku e the quantity requested by the internalOrder
        const sku = await db.getSkuById(id);
        const quantity = sku.AVAILABLEQUANTITY - requestedQuantity;
        await db.updateQuantity(id, quantity)
    }


    deleteSkuById(req, res) {
        try {
            db.deleteSkuById(req.params.id);
            res.status(204).end();
        } catch (err) {
            res.status(500).end();
        }
    }
}


module.exports = SkuManagement;
