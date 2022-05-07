'use strict'

const db = require('../database/test-descriptorDAO');

class TestDescriptorManagement {

    constructor() { }

    async createTestDescriptor(req, res) {
        const data = req.body;
        if (data.length === 0 || data.name === undefined || data.name === '' || data.name === null ||
            data.procedureDescription === undefined || data.procedureDescription === '' || data.procedureDescription === null ||
            data.idSKU === undefined || isNaN(data.idSKU) || data.idSKU === null) {
            return res.status(422).end();
        }

        // const sku = await getSkuById(data.idSKU);
        // if(sku === undefined || sku === null){
        //     res.status(404).end();
        // }

        let lastID = await db.getLastID();
        if (lastID['last'] === null){
            lastID['last'] = 0;
        }
        else{
            lastID['last'] += 1;
        }
        try {
            db.createTestDescriptor(lastID['last'], data);
            res.status(201).end();
        } catch (err) {
            res.status(503).end();
        }
    }

    async getListTestDescriptors(req, res) {
        try{
            const list = await db.getListTestDescriptors();
            res.status(200).json(list);
        }catch{
            res.status(500).end();
        }
    }

    async getTestDescriptorByID(req, res) {
        const id = req.params.id;
        if(isNaN(id) || id === undefined || id === null) {
            return res.status(422).end();
        }

        try{
            const testDescriptor = await db.getTestDescriptorByID(id);
            if ( testDescriptor === undefined || testDescriptor === null){
                return res.status(404).end();
            }
            else{
                return res.status(200).json(testDescriptor);
            }
        }catch{
            res.status(503).end();
        }
    }

    async modifyTestDescriptorByID(req, res) {
        const data = req.body;
        const id = req.params.id;
        if (data.length === 0 || data.newName === undefined || data.newName === '' || data.newName === null ||
            data.newIdSKU === undefined || isNaN(data.newIdSKU) || data.newName === null ||
            data.newProcedureDescription === '' || data.newProcedureDescription === undefined || data.newProcedureDescription === null ||
            isNaN(id) || id === undefined || id === null) {
            return res.status(422).end();
        }
        try {
            //const sku = await getSkuByID(data.newIdSKU);
            const testDescriptor = await db.getTestDescriptorByID(id);
            if(
                //sku === undefined || sku === null || 
                testDescriptor === undefined || testDescriptor === null){
                res.status(404).end();
            }
            db.modifyTestDescriptorByID(id, data);
            res.status(200).end();
        } catch (err) {
            res.status(503).end();
        }
    }

    async deleteTestDescriptorByID(req, res) {
        const id = req.params.id;
        if (id === null || id === undefined || isNaN(id)) {
            return res.status(422).end();
        }
        try {
            db.deleteTestDescriptorByID(id);
            res.status(204).end();
        } catch (err) {
            res.status(503).end();
        }
    }
}

module.exports = TestDescriptorManagement;