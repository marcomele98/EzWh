'use strict'

const db = require('../database/test-descriptorDAO');
const dbSKU = require('../database/skuDAO');


class TestDescriptorManagement {

    constructor() { }

    noContent = (data) => {
        return data=== null || data === undefined;
    }

    isNotValidBody = (data) => {
        return data === undefined || data === null || data.length === 0;
    }

    isNotValidProcedureDesc = (procedureDescription) => {
        return procedureDescription === undefined || procedureDescription === '' || procedureDescription === null;
    }

    isNotValidIdSKU = (idSKU) => {
        return idSKU === undefined || isNaN(idSKU) || idSKU === null;
    }

    isNotValidID = (id) => {
        return id === undefined || id === null || isNaN(id);
    }

    isNotValidName = (name) => {
        return name === undefined || name === '' || name === null;
    }

    async createTestDescriptor(req, res) {
        const data = req.body;
        if (this.isNotValidBody(data) || this.isNotValidName(data.name) ||
            this.isNotValidProcedureDesc(data.procedureDescription) ||
            this.isNotValidIdSKU(data.idSKU)) {
            return res.status(422).end();
        }

        try {
            const sku = await dbSKU.getSkuById(data.idSKU);
            if(this.noContent(sku)){
                return res.status(404).end();
            }

            let lastID = await db.getLastID();
            if (lastID['last'] === null){
                lastID['last'] = 1;
            }
            else{
                lastID['last'] += 1;
            }
            await db.createTestDescriptor(lastID['last'], data);
            return res.status(201).end();
        } catch (err) {
            return res.status(503).end();
        }
    }

    async getListTestDescriptors(req, res) {
        try{
            const list = await db.getListTestDescriptors();
            return res.status(200).json(list);
        }catch{
            return res.status(500).end();
        }
    }

    async getTestDescriptorByID(req, res) {
        const id = req.params.id;
        if(this.isNotValidID(id)) {
            return res.status(422).end();
        }

        try{
            const testDescriptor = await db.getTestDescriptorByID(id);
            if ( this.noContent(testDescriptor)){
                return res.status(404).end();
            }
            else{
                return res.status(200).json(testDescriptor);
            }
        }catch{
            return res.status(503).end();
        }
    }

    async modifyTestDescriptorByID(req, res) {
        const data = req.body;
        const id = req.params.id;
        if (this.isNotValidBody(data) || this.isNotValidName(data.newName) ||
            this.isNotValidIdSKU(data.newIdSKU)|| this.isNotValidProcedureDesc(data.newProcedureDescription) ||
            this.isNotValidID(id)) {
            return res.status(422).end();
        }
        try {
            const sku = await dbSKU.getSkuById(data.newIdSKU);
            const testDescriptor = await db.getTestDescriptorByID(id);
            if(
                this.noContent(sku) ||
                this.noContent(testDescriptor)){
                return res.status(404).end();
            }
            await db.modifyTestDescriptorByID(id, data);
            return res.status(200).end();
        } catch (err) {
            return res.status(503).end();
        }
    }

    async deleteTestDescriptorByID(req, res) {
        const id = req.params.id;
        if (this.isNotValidID(id)) {
            return res.status(422).end();
        }
        try {
            await db.deleteTestDescriptorByID(id);
            return res.status(204).end();
        } catch (err) {
            return res.status(503).end();
        }
    }
}

module.exports = TestDescriptorManagement;