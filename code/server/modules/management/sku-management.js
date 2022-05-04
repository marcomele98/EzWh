'use strict'
const DAO = require ('../DAO');
const db = new DAO ('database');

class SkuManagement {
    constructor() {
    }
    /*
    sqlite = require('sqlite');
    constructor(dbname){
        this.db = new this.sqlite.Databse(dbname, (err) => {
            if(err) throw err;
        });
    }
    */
    async getSkuList (req, res) {
        try{
            const skuList = await db.getSkuList();
            res.status(200).json(skuList);
        } catch(err) {
            res.status(501).end();
        }
    }

    async getSkuById(req,res) {
        const id = req.params.id;
        
        if (id === undefined || id === ''){
            return res.status(442).json({error: 'Invalid id'});
        }
        const integerId = parseInt(id,10);
        try{
            const sku = await db.getSkuById(integerId);
            res.status(200).json(sku);
        }catch(err){
            res.status(404).end(); 
        }
    }

    async addSku(req,res){
        if (Object.keys(req.body).length === 0) {
            return res.status(422).json({ error: `Empty body request` });
        }
        let sku = req.body;
        if (sku.description === '' || sku.price == 0 ||  sku.weigth == 0 || sku.volume == 0 || sku.notes === '' || sku.availableQuantity == 0) {
            return res.status(422).json({ error: `Invalid item data` });
        }
        await db.newTableSku();
        db.addSku(sku);
        return res.status(201).end();
    }


    async updateSkuInfo(req, res){
        const id = req.params.id
        const data = req.body;
        if (id == undefined || id == '') {
            return res.status(422).json({ error: `Invalid id` });
        }
        const integerID = parseInt(id, 10);
        try  {
            const sku = await db.updateSkuInfo(integerID, data);
            res.status(200).json(sku);
        } catch (err) {
            res.status(404).end();
        }
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
