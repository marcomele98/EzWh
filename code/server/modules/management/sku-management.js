"use strict"


const db = require('../database/skuDAO');
const dbPos = require('../database/positionDAO');
const dbTest = require('../database/test-descriptorDAO');

class SkuManagement {
    constructor() {
    }


    async getSkuList(req, res) {
        try {
            const skuList = await db.getSkuList();
            for (var i = 0; i < skuList.length; i++) {
                const testDescriptors = await dbTest.getTestListBySKU(skuList[i].id);
                skuList[i].testDescriptors = testDescriptors.map(value => value.id);
            }
            res.status(200).json(skuList);
        }
        catch (err) {
            res.status(500).end();
        }
    }

    async getSkuById(req, res) {
        const id = req.params.id;

        if (id === undefined || id === '' || id == 0) {
            return res.status(422).json({ error: 'Invalid id' });
        }
        try {
            const sku = await db.getSkuById(id);
            const testDescriptors = await dbTest.getTestListBySKU(id);
            sku.testDescriptors = testDescriptors.map(value => value.id);
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
        if (sku.description === '' || sku.price <= 0  || sku.price == undefined || sku.weight <= 0 || sku.volume <= 0 ||
            sku.notes === '' || sku.availableQuantity <= 0 || sku.description === undefined ||
            isNaN(sku.description) !== true || isNaN(sku.notes) !== true || sku.price == undefined ||
            sku.weight === undefined || sku.weight === '' || sku.volume == undefined ||
            sku.notes === undefined || sku.availableQuantity == undefined
            || isNaN(sku.price) || isNaN(sku.weight) || isNaN(sku.volume) || isNaN(sku.availableQuantity)) {
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
        const oldSku = await db.getSkuById(id);

        //Checks to get the old value when a field is undefined
        if (data.newDescription == undefined){
            data.newDescription = oldSku.description;
        }
        if(data.newVolume == undefined){
            data.newVolume =oldSku.volume;
        }
        if(data.newWeight == undefined){
            data.newWeight = oldSku.weight;
        }
        if(data.newNotes == undefined){
            data.newNotes = oldSku.notes;
        }
        if(data.newAvailableQuantity == undefined){
            data.newAvailableQuantity = oldSku.availableQuantity;
        }
        if(data.newPrice == undefined){
            data.newPrice = oldSku.price;
        }

        //Checks on the id
        if (id == undefined || id == '' || data.length == 0 || isNaN(id) || data.newDescription == ''
            || isNaN(data.newWeight) || data.newWeight <= 0 || data.newWeight === ''
            || isNaN(data.newVolume) || data.newVolume <= 0 || data.newVolume === ''
            || data.newNotes === '' || isNaN(data.newDescription) !== true || isNaN(data.newNotes) !== true ||
            data.newPrice <= 0 || data.newPrice === '' || isNaN(data.newPrice)
            || data.newAvailableQuantity <= 0 || data.newAvailableQuantity === '' || isNaN(data.newAvailableQuantity)) {
            return res.status(422).end();
        }

        const position = oldSku.position;
        if (oldSku !== undefined) {
            try {
                await db.updateSkuInfo(id, data);
                const updatedSKU = await db.getSkuById(id);
                if (position !== undefined || position !== 0 || !isNaN(position)) {
                    const newWeight = updatedSKU.weight * updatedSKU.availableQuantity;
                    const newVolume = updatedSKU.volume * updatedSKU.availableQuantity;
                    await dbPos.updateInfoBySKU(position, newWeight, newVolume);
                }
                res.status(200).end();
            } catch (err) {
                res.status(503).end();
            }
        } else { res.status(404).end() }
    }

    async updateSkuPosition(req, res) {
        const id = req.params.id;
        const position = req.body.position;
        if (id == undefined || id == '' || id == 0 || position == undefined || position == 0 || position == '') {
            return res.status(422).json({ error: 'Invalid id ' });
        }
        const sku = await db.getSkuById(id);
        const newWeight = sku.weight * sku.availableQuantity;
        const newVolume = sku.volume * sku.availableQuantity;
        const pos = await dbPos.getPositionByID(position);
        if (pos.maxWeight < newWeight || pos.maxVolume < newVolume) {
            return res.status(422).end();
        }
        if (sku !== undefined || pos !== undefined) {
            try {
                await db.setPosition(id, position);
                await dbPos.updateInfoBySKU(position, newWeight, newVolume);
                res.status(200).end();
            } catch (err) {
                res.status(503).end();
            }
        } else {
            res.status(404).end()
        }
    }

    deleteSkuById(req, res) {
        const id = req.params.id;
        if (id == undefined || id == '' || id == 0) {
            res.status(422).end();
        }
        try {

            db.deleteSkuById(id);
            res.status(204).end();
        } catch (err) {
            res.status(500).end();
        }
    }
}


module.exports = SkuManagement;
