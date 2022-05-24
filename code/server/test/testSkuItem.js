const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const dayjs = require('dayjs')
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat);

const skuItemDAO = require('../modules/database/skuItemDAO');

describe('test skuItem APIs', () => {
    beforeEach(async () => {
        await skuItemDAO.deleteTableContent();
        await skuItemDAO.resetTable();
    })

    skuItem = {
        "RFID": "12345678901234567890123456789015",
        "SKUId": 1,
        "DateOfStock": "2021/11/29 12:30"
    }

    skuItem2 = {
        "RFID": "22345678901234567890123456789015",
        "SKUId": 1,
        "DateOfStock": "2021/11/28 12:30"
    }

    skuitem3 = {
        "RFID": "32345678901234567890123456789015",
        "SKUId": 1,
        "DateOfStock": "2021/11/29 12:30"
    }
    skuItemWrong = {
        "RFID": "2345678901234567890123456789015", //miss one value of RFID
        "SKUId": 1,
        "DateOfStock": "2021/11/29 12:30"
    }
    skuItemWrong2 = {
        "RFID": "12345678901234567890123456789015",
        "SKUId": 8,
        "DateOfStock": "2021/11/29 12:30"
    }

    newSkuItem = {
        "newRFID": "12345678901234567890123456789015",
        "newAvailable": 1,
        "newDateOfStock": "2021/11/29 12:30"
    }

    newSkuItemWrong = {
        "newRFID": "345678901234567890123456789015", //wrong value for RFID
        "newAvailable": 1,
        "newDateOfStock": "2021/11/29 12:30"
    }



    deleteSkuItem(204, skuItem, "12345678901234567890123456789015");
    deleteSkuItem(404, skuItem, "52345678901234567890123456789015");
    deleteSkuItem(422, skuItem, "124");
    addNewSkuItem(201, skuItem);
    addNewSkuItem(422, skuItemWrong);
    updateSkuItem(200, skuItem2, newSkuItem, "22345678901234567890123456789015");
    updateSkuItem(422, skuItem2, newSkuItemWrong, "22345678901234567890123456789015");
    getSkuItemByRFID(200, skuItem, "12345678901234567890123456789015");
    getSkuItemByRFID(404, skuItem, "22345678901234567890123456789015"); //no RFID in DB
    getSkuItemByRFID(422, skuItem2, "345678901234567890123456789015"); //wrong RFID format
    getSkuItemBySKUID(200, skuItem, skuItem2, 1);
    getSkuItemBySKUIDwithValue(200, skuItem, newSkuItem, 1);
    getSkuItemBySKUID(422, skuItem, skuItem2, "ciao"); //validation failed
    getSkuItemBySKUIDwithValue(422, skuItem, newSkuItem, "ciao" );
    getSkuItemList(200, skuItem, skuItem2);
});

function deleteSkuItem(expectedHTTPStatus, skuItem, RFID) {
    it('delete skuItem', function (done) {
        let SKUItem = { RFID: skuItem.RFID, SKUId: skuItem.SKUId, DateOfStock: skuItem.DateOfStock };
        agent.post('/api/skuitem').send(SKUItem).then(function (res) {
            res.should.have.status(201);
            agent.delete('/api/skuitems/' + RFID).then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
        });
    });
}


function addNewSkuItem(expectedHTTPStatus, skuItem) {
    it('adding a new skuItem', function (done) {
        let SKUItem = { RFID: skuItem.RFID, SKUId: skuItem.SKUId, DateOfStock: skuItem.DateOfStock };
        agent.post('/api/skuItem').send(SKUItem).then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            if (res == 201) {
                agent.get('/api/skuitems/' + SKUItem.RFID).then(function (r) {
                    r.body.RFID.should.equal(skuItem.RFID);
                    r.body.SKUId.should.equal(skuItem.SKUId);
                    r.body.DateOfStock.should.equal(skuItem.DateOfStock);
                });
            } done();
        });
    });
}

function updateSkuItem(expectedHTTPStatus, skuItem, newSkuItem, RFID) {
    it('modify sku item info', function (done) {
        let SKUItem = { RFID: skuItem.RFID, SKUId: skuItem.SKUId, DateOfStock: skuItem.DateOfStock };
        agent.post('/api/skuitem').send(SKUItem).then(function (res) {
            res.should.have.status(201);
            agent.put('/api/skuitems/' + RFID).send(newSkuItem).then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status == 200) {
                    agent.get('/api/skuitems/' + RFID).then(function (res1) {
                        res1.should.have.status(200);
                        res1.body.RFID.should.equal(newSkuItem.newRFID);
                        res1.body.Available.should.equal(newSkuItem.newAvailable);
                        res1.body.DateOfStock.should.equal(newSkuItem.newDateOfStock);
                    });
                }
                done();
            });
        });
    });
}

function getSkuItemByRFID(expectedHTTPStatus, skuItem, RFID) {
    it('get skuItem by RFID', function (done) {
        let SKUItem = { RFID: skuItem.RFID, SKUId: skuItem.SKUId, DateOfStock: skuItem.DateOfStock };
        agent.post('/api/skuitem').send(SKUItem).then(function (res) {
            res.should.have.status(201);
            agent.get('/api/skuitems/' + RFID).then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status == 200) {
                    r.body.RFID.should.equal(SKUItem.RFID);
                    r.body.SKUId.should.equal(SKUItem.SKUId);
                    r.body.DateOfStock.should.equal(SKUItem.DateOfStock);
                }
                done();
            });
        });
    });
}

function getSkuItemBySKUID(expectedHTTPStatus, skuItem1, skuItem2, SKUId) {
    it('get skuItem by SKUId', function (done) {
        let sku = { id: 1, description: "test for sku item", weight: 10, volume: 10, notes: "test", availableQuantity: 5, price: 4.44 };
        agent.post('/api/sku').send(sku).then(function (res) {
            res.should.have.status(201);
            agent.post('/api/skuitem').send(skuItem1).then(function (res1) {
                res1.should.have.status(201);
                agent.post('/api/skuitem').send(skuItem2).then(function (res2) {
                    res2.should.have.status(201);
                    agent.get('/api/skuitems/sku/' + SKUId).then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        if (r.status == 200) {
                            r.body.length.should.equal(0);
                        } done();
                    });
                });
            });
        });
    });
}

function getSkuItemBySKUIDwithValue(expectedHTTPStatus, skuItem1, newSkuItem, SKUId) {
    it('get skuItem by SKUId with Value', function (done) {
        let sku = { id: 1, description: "test for sku item", weight: 10, volume: 10, notes: "test", availableQuantity: 5, price: 4.44 };
        agent.post('/api/sku').send(sku).then(function (res) {
            res.should.have.status(201);
            agent.post('/api/skuitem').send(skuItem1).then(function (res1) {
                res1.should.have.status(201);
                agent.put('/api/skuitems/' + skuItem1.RFID).send(newSkuItem).then(function (res3) {
                    res3.should.have.status(200);
                    agent.get('/api/skuitems/sku/' + SKUId).then(function (r) {
                        r.should.have.status(expectedHTTPStatus);

                        if (r.status == 200) {
                            r.body.length.should.equal(1);
                        } done();
                    });
                });
            });
        });
    });
}


function getSkuItemList(expectedHTTPStatus, skuItem, skuItem2) {
    it('get sku item list', function (done) {
        agent.post('/api/skuitem').send(skuItem).then(function (res) {
            res.should.have.status(201);
            agent.post('/api/skuitem').send(skuItem2).then(function (res) {
                res.should.have.status(201);
                agent.get('/api/skuitems').then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    r.body.length.should.equal(2);
                    done();
                });
            });
        });
    });

}