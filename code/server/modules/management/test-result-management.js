'use strict'

const dayjs = require('dayjs')
const db = require('../database/test-resultDAO');
const dbTestDescriptor = require('../database/test-descriptorDAO');

class TestResultManagement {

    constructor() { }

    async getTestResultsListByRfid(req, res){
        const rfid = req.params.rfid;
        if(rfid === undefined || rfid === null || rfid.length !== 32){
            return res.status(422).end();
        }
        try{
            // const skuItem = await db.getSKUITEMbyRFID(rfid);
            // if (skuItem === undefined || skuItem === null){
            //     res.status(404).end();
            // }
            const listResults = await db.getTestResultsListByRfid(rfid);
            res.status(200).json(listResults.map( e => ({
                id: e.id,
                idTestDescriptor: e.idTestDescriptor,
                Date: e.Date,
                Result: e.Result? true:false
            }) ));
        }catch{
            res.status(500).end();
        }
    }

    async getTestResultByIds(req, res){
        const rfid = req.params.rfid;
        const id = req.params.id;
        if (rfid === undefined || rfid === null || rfid.length !== 32 ||
            id === undefined || id === null || isNaN(id)){
                return res.status(422).end(); 
        }
        try{
            // const skuItem = await db.getSKUITEMbyRFID(rfid);
            // if (skuItem === undefined || skuItem === null){
            //     res.status(404).end();
            // }
            const result = await db.getTestResultByIds(id, rfid);
            res.status(200).json(result.map( e => ({
                id: e.id,
                idTestDescriptor: e.idTestDescriptor,
                Date: e.Date,
                Result: e.Result? true:false
            }) ));
        }catch{
            res.status(500).end();
        }
    }

    async createTestResultByRfid(req, res){
        const data = req.body;
        if(data === undefined || data === null || data.length === 0 || 
            data.rfid === undefined || data.rfid === null || data.rfid.length !== 32 || 
            data.idTestDescriptor === undefined || data.idTestDescriptor === null || isNaN(data.idTestDescriptor) ||
            data.Result === undefined || data.Result === null || !(data.Result === true || data.Result === false) ||
            dayjs(data.Date, 'YYYY-MM-DD', true).isValid() !== true ){
                return res.status(422).end();
        }
        try{
            // const skuItem = await db.getSKUITEMbyRFID(rfid);
            const testDescriptor = await dbTestDescriptor.getTestDescriptorByID(data.idTestDescriptor);
             if (testDescriptor === undefined || testDescriptor === null
            //     || skuItem === undefined || skuItem === null
            ){
                return res.status(404).end();
            }

            let lastID = await db.getLastID();
            if (lastID['last'] === null){
                lastID['last'] = 0;
            }
            else{
                lastID['last'] += 1;
            }

            db.createTestResultByRfid(lastID['last'], data);
            res.status(201).end();
        }catch{
            res.status(503).end();
        }
    }

    async modifyTestResultByIds(req, res){
        const rfid = req.params.rfid;
        const id = req.params.id;
        let data = req.body;
        if (rfid === undefined || rfid === null || rfid.length !== 32 ||
            id === undefined || id === null || isNaN(id) ||
            data === undefined || data === null || data.length === 0 || 
            data.newIdTestDescriptor === undefined || data.newIdTestDescriptor === null || isNaN(data.newIdTestDescriptor) ||
            data.newResult === undefined || data.newResult === null || !(data.newResult === true || data.newResult === false) ||
            dayjs(data.newDate, 'YYYY-MM-DD', true).isValid() !== true ){
                return res.status(422).end(); 
        }
        try{
            // const skuItem = await db.getSKUITEMbyRFID(rfid);
            const testDescriptor = await dbTestDescriptor.getTestDescriptorByID(data.newIdTestDescriptor);
            const testResult = await db.getTestResultByIds(id, rfid);
             if (testDescriptor === undefined || testDescriptor === null ||
                testResult === undefined || testResult === null
            //     || skuItem === undefined || skuItem === null
            ){
                return res.status(404).end();
            }
            data = data.map( d => ({
                newIdTestDescriptor: data.newIdTestDescriptor,
                newDate: data.newDate,
                newResult: data.newResult? 1:0
            }));
            db.modifyTestResultByIds(id, data, rfid);
            res.status(200).end();
        }catch{
            res.status(503).end();
        }
    }

    async deleteTestResultByIds(req, res){
        const rfid = req.params.rfid;
        const id = req.params.id;
        if (rfid === undefined || rfid === null || rfid.length !== 32 ||
            id === undefined || id === null || isNaN(id)){
                return res.status(422).end(); 
        }
        try{
            db.deleteTestResultByIds(id, rfid);
            res.status(204).end();
        }catch{
            res.status(503).end();
        }
    }

}

module.exports = TestResultManagement;