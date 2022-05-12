'use strict'

const dayjs = require('dayjs')
const db = require('../database/test-resultDAO');
const dbTestDescriptor = require('../database/test-descriptorDAO');
const dbSKUItem = require('../database/skuItemDAO');
const dbSKUREItem = require('../database/restockOrderDAO');

class TestResultManagement {

    constructor() {
        this.regexp = new RegExp('^[0-9]+$');
    }

    noContent = (data) => {
        return data === null || data === undefined;
    }

    isNotValidRFID = (rfid) => {
        return rfid === undefined || rfid === null || rfid.length !== 32 || !this.regexp.test(rfid);
    }

    isNotValidID = (id) => {
        return id === undefined || id === null || isNaN(id);
    }

    isNotValidIdTestDescriptor = (idTestDescriptor) => {
        return idTestDescriptor === undefined || idTestDescriptor === null || isNaN(idTestDescriptor);
    }

    isNotValidResult = (Result) => {
        return Result === undefined || Result === null || !(Result === true || Result === false);
    }

    isNotValidBody = (data) => {
        return data === undefined || data === null || data.length === 0;
    }

    isNotValidDate = (Date) => {
        return dayjs(Date, 'YYYY-MM-DD', true).isValid() !== true;
    }

    async getTestResultsListByRfid(req, res) {
        const rfid = req.params.rfid;
        if (this.isNotValidRFID(rfid)) {
            return res.status(422).end();
        }
        try {
            const skuItem = await dbSKUItem.getSkuItemByRfid(rfid);
            if (this.noContent(skuItem)) {
                return res.status(404).end();
            }
            const listResults = await db.getTestResultsListByRfid(rfid);
            res.status(200).json(listResults.map(e => ({
                id: e.id,
                idTestDescriptor: e.idTestDescriptor,
                Date: e.Date,
                Result: e.Result ? true : false
            })));
        } catch {
            res.status(500).end();
        }
    }

    async getTestResultByIds(req, res) {
        const rfid = req.params.rfid;
        const id = req.params.id;
        if (this.isNotValidRFID(rfid) || this.isNotValidID(id)) {
            return res.status(422).end();
        }
        try {
            const skuItem = await dbSKUItem.getSkuItemByRfid(rfid);
            if (this.noContent(skuItem)) {
                return res.status(404).end();
            }
            const result = await db.getTestResultByIds(id, rfid);
            result.Result = result.Result ? true : false;
            res.status(200).json(result);
        } catch {
            res.status(500).end();
        }
    }

    async createTestResultByRfid(req, res) {
        const data = req.body;
        if (this.isNotValidBody(data) || this.isNotValidRFID(data.rfid) ||
            this.isNotValidIdTestDescriptor(data.idTestDescriptor) ||
            this.isNotValidResult(data.Result) || this.isNotValidDate(data.Date)) {
            return res.status(422).end();
        }
        try {
            const skuItem = await dbSKUItem.getSkuItemByRfid(data.rfid);
            const skuRE = await dbSKUItem.getSkuItemByRfid(data.rfid);
            const testDescriptor = await dbTestDescriptor.getTestDescriptorByID(data.idTestDescriptor);
            if (this.noContent(testDescriptor) || this.noContent(skuItem) || this.noContent(skuRE)) {
                return res.status(404).end();
            }

            let lastID = await db.getLastID();
            if (lastID['last'] === null) {
                lastID['last'] = 0;
            }
            else {
                lastID['last'] += 1;
            }

            await db.createTestResultByRfid(lastID['last'], data);
            res.status(201).end();
        } catch {
            res.status(503).end();
        }
    }

    async modifyTestResultByIds(req, res) {
        const rfid = req.params.rfid;
        const id = req.params.id;
        let data = req.body;
        if (this.isNotValidBody(data) || this.isNotValidRFID(rfid) || this.isNotValidID(id) ||
            this.isNotValidIdTestDescriptor(data.newIdTestDescriptor) ||
            this.isNotValidResult(data.newResult) || this.isNotValidDate(data.newDate)) {
            return res.status(422).end();
        }
        try {
            const skuItem = await dbSKUItem.getSkuItemByRfid(rfid);
            const testDescriptor = await dbTestDescriptor.getTestDescriptorByID(data.newIdTestDescriptor);
            const testResult = await db.getTestResultByIds(id, rfid);
            if (this.noContent(testDescriptor) || this.noContent(testResult) || this.noContent(skuItem)) {
                return res.status(404).end();
            }
            data.newResult = data.newResul ? 1: 0;
            await db.modifyTestResultByIds(id, data, rfid);
            res.status(200).end();
        } catch {
            res.status(503).end();
        }
    }

    async deleteTestResultByIds(req, res) {
        const rfid = req.params.rfid;
        const id = req.params.id;
        if (this.isNotValidRFID(rfid) || this.isNotValidID(id)) {
            return res.status(422).end();
        }
        try {
            await db.deleteTestResultByIds(id, rfid);
            res.status(204).end();
        } catch {
            res.status(503).end();
        }
    }

}

module.exports = TestResultManagement;