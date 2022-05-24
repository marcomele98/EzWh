"use strict"

const dayjs = require('dayjs');
const db = require('../database/returnOrderDAO');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat);

class ReturnOrderManagement {

    constructor() { }

    async createNewReturnOrder(req, res) {
        let returnOrder = req.body;
        if (returnOrder === undefined || 
            returnOrder.returnDate === undefined || 
            returnOrder.products === undefined || 
            returnOrder.restockOrderId === undefined || 
            returnOrder == '' || 
            returnOrder.returnDate === '' || 
            returnOrder.products === '' || 
            returnOrder.restockOrderId === "" || 
            returnOrder.restockOrderId <= 0|| 
            isNaN(returnOrder.restockOrderId) || 
             !dayjs(returnOrder.returnDate, ['YYYY/MM/DD', 'YYYY/MM/DD hh:mm', 'YYYY/M/DD', 'YYYY/M/DD hh:mm', 'YYYY/MM/D', 'YYYY/MM/D hh:mm', 'YYYY/M/D', 'YYYY/M/D hh:mm'], true).isValid()) {
                return res.status(422).end();
        }
        for (var i = 0; i < returnOrder.products.length; i++) {
            if (
                returnOrder.products[i].SKUId == undefined || 
                returnOrder.products[i].SKUId <= 0 || 
                returnOrder.products[i].SKUId == '' || 
                isNaN(returnOrder.products[i].SKUId) ||
                !isNaN(returnOrder.products[i].description) || 
                returnOrder.products[i].description == undefined || 
                returnOrder.products[i].description == '' || 
                returnOrder.products[i].price <= 0 ||
                returnOrder.products[i].price == undefined || 
                returnOrder.products[i].price == '' || 
                isNaN(returnOrder.products[i].price) ||
                returnOrder.products[i].RFID == undefined ||
                returnOrder.products[i].RFID <= 0 ||
                returnOrder.products[i].RFID.length != 32 ||
                returnOrder.products[i].RFID == '' 
            ) {
                return res.status(422).end();
            }
        }
        try {
            await db.storeReturnOrder(returnOrder);
            const RET = await db.getLastId();
            db.storeProductRET(returnOrder.products, RET["MAX(id)"]);
            return res.status(201).end();
        }
        catch (err) {
            return res.status(503).end();
        }
    }


    async getListReturnOrder(req, res) {
        try {
            const listReturnOrders = await db.getListReturnOrders();
            for (var i = 0; i < listReturnOrders.length; i++) {
                const products = await db.getListProductRET(listReturnOrders[i].id);
                listReturnOrders[i].products = products;
            }
            res.status(200).json(listReturnOrders);
        } catch (err) {
            res.status(500).end();
        }
    }

    async getReturnOrderById(req, res) {
        const id = req.params.id;
        if (id == undefined || id == '' || isNaN(id) || id <= 0) {
            
            return res.status(422).end();
        }
        try {
            var returnOrder = await db.getReturnOrderById(id);
            if (returnOrder == undefined) {
                return res.status(404).end();
            }
            const products = await db.getListProductRET(id);
            returnOrder.products = products;
            returnOrder = {
                "returnDate" : returnOrder.returnDate,
                "products" : products,
                "restockOrderId" : returnOrder.restockOrderId
            }
            
            return res.status(200).json(returnOrder);
        } catch (err) {
            res.status(500).end();
        }
    }

    async deleteReturnOrderById(req, res) {
        const id = req.params.id;
        if (id == undefined || id == '' || isNaN(id) || id <= 0) {
            return res.status(422).end();
        }
        try {
            if(await db.getReturnOrderById(id) === undefined){
                res.status(404).end();
            }
            db.deleteReturnOrderById(id);
            res.status(204).end();
        } catch (err) {
            res.status(500).end();
        }
    }
    
}

module.exports = ReturnOrderManagement;