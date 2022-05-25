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
const skuDAO = require('../modules/database/skuDAO');

describe('test skuItem APIs', () => {
    beforeEach(async () => {
        await skuItemDAO.deleteTableContent();
        await skuItemDAO.resetTable();
        await skuDAO.deleteTableContent();
        await skuDAO.resetTable();
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

    sku = {
        "description": "a new sku",
        "weight": 20,
        "volume": 10,
        "notes": "first order",
        "availableQuantity": 10,
        "price": 20.00,
    }

    addNewSkuItem(201, skuItem, sku);
    addNewSkuItem(422, skuItemWrong, sku);
    addNewSkuItem(404, skuItemWrong2, sku);
    updateSkuItem(200, skuItem2, newSkuItem, "22345678901234567890123456789015", sku);
    updateSkuItem(422, skuItem2, newSkuItemWrong, "22345678901234567890123456789015", sku);
    updateSkuItem(422, skuItem2, newSkuItem, "2", sku); //wrong RFID
    updateSkuItem(404, skuItem, newSkuItem, "82345678901234567890123456789015", sku) // no skuItem exist associated to this RFID
    getSkuItemByRFID(200, skuItem, "12345678901234567890123456789015", sku);
    getSkuItemByRFID(404, skuItem, "22345678901234567890123456789015", sku); //no RFID in DB
    getSkuItemByRFID(422, skuItem2, "345678901234567890123456789015", sku); //wrong RFID format
    getSkuItemBySKUID(200, skuItem, skuItem2, 1, sku);
    getSkuItemBySKUIDwithValue(200, skuItem, newSkuItem, 1, sku);
    getSkuItemBySKUID(422, skuItem, skuItem2, "ciao", sku); //validation failed
    getSkuItemBySKUID(404, skuItem, skuItem2, 3, sku); //skuId does not exist
    getSkuItemBySKUIDwithValue(422, skuItem, newSkuItem, "ciao", sku);
    getSkuItemList(200, skuItem, skuItem2, sku);
    deleteSkuItem(422, skuItem, "124", sku);
    deleteSkuItem(204, skuItem, "12345678901234567890123456789015", sku);

});

function deleteSkuItem(expectedHTTPStatus, skuItem, RFID, sku) {
    it('delete skuItem', function (done) {
        let SKUItem = { RFID: skuItem.RFID, SKUId: skuItem.SKUId, DateOfStock: skuItem.DateOfStock };
        agent.post('/api/sku').send(sku).then(function (result) {
            result.should.have.status(201);
            agent.post('/api/skuitem').send(SKUItem).then(function (res) {
                res.should.have.status(201);
                agent.delete('/api/skuitems/' + RFID).then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    done();
                });
            });
        });
    });
}


function addNewSkuItem(expectedHTTPStatus, skuItem, sku) {
    it('adding a new skuItem', function (done) {
        agent.post('/api/sku').send(sku).then(function (result) {
            result.should.have.status(201);

            agent.post('/api/skuItem').send(skuItem).then(function (res) {
                res.should.have.status(expectedHTTPStatus);

                if (res == 201) {
                    agent.get('/api/skuitems/' + skuItem.RFID).then(function (r) {
                        r.body.RFID.should.equal(skuItem.RFID);
                        r.body.SKUId.should.equal(skuItem.SKUId);
                        r.body.DateOfStock.should.equal(skuItem.DateOfStock);
                    }); e
                } done();
            });
        });
    });
}

function updateSkuItem(expectedHTTPStatus, skuItem, newSkuItem, RFID, sku) {
    it('modify sku item info', function (done) {
        let SKUItem = { RFID: skuItem.RFID, SKUId: skuItem.SKUId, DateOfStock: skuItem.DateOfStock };
        agent.post('/api/sku').send(sku).then(function (result) {
            result.should.have.status(201);
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
    });
}

function getSkuItemByRFID(expectedHTTPStatus, skuItem, RFID, sku) {
    it('get skuItem by RFID', function (done) {
        let SKUItem = { RFID: skuItem.RFID, SKUId: skuItem.SKUId, DateOfStock: skuItem.DateOfStock };
        agent.post('/api/sku').send(sku).then(function (result) {
            result.should.have.status(201);
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
    });
}

function getSkuItemBySKUID(expectedHTTPStatus, skuItem1, skuItem2, SKUId, sku) {
    it('get skuItem by SKUId', function (done) {
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

function getSkuItemBySKUIDwithValue(expectedHTTPStatus, skuItem1, newSkuItem, SKUId, sku) {
    it('get skuItem by SKUId with Value', function (done) {
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


function getSkuItemList(expectedHTTPStatus, skuItem, skuItem2, sku) {
    it('get sku item list', function (done) {
        agent.post('/api/sku').send(sku).then(function (result) {
            result.should.have.status(201);
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
    });

}
