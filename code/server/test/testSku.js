const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const dayjs = require('dayjs')
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat);

const skuDAO = require('../modules/database/skuDAO');

describe('test sku APIs', () => {
    beforeEach(async () => {
        await skuDAO.deleteTableContent();
    })

    pos = {
        "positionID": "800234543412",
        "aisleID": "8002",
        "row": "3454",
        "col": "3412",
        "maxWeight": 1000,
        "maxVolume": 1000,
    }
    newSku = {
        "newDescription": "a new sku",
        "newWeight": 100,
        "newVolume": 50,
        "newNotes": "first SKU",
        "newPrice": 10.99,
        "newAvailableQuantity": 10,
    }

    sku = {
        "id": "1",
        "description": "a new sku",
        "weight": 20,
        "volume": 10,
        "notes": "first order",
        "availableQuantity": 10,
        "price": 20.00,
    }

    sku3 = {
        "id": "3",
        "description": "a new sku 3",
        "weight": 12,
        "volume": 14,
        "notes": "third order",
        "availableQuantity": 20,
        "price": 20.00,
    }
    deleteSku(204, sku, 1);
    addNewSku(201, 1, "prova", 10, 10, "test", 20, 4.99); //correct data
    addNewSku(422, 2, 1241, 10, 10, "test", 20, 4.99); //wrong description
    updatePositionOfSku(200, sku, pos, "800234543412");
    updateSku(200, sku, newSku, 1);
    getSku(200, 1, "prova", 10, 10, "test", 20, 4.99, 1);
    getSku(404, 2, " prova 2", 5, 5, "prova 404", 4, 10.99, 4);
    getSkuList(200, sku3);
});

function deleteSku(expectedHTTPStatus, sku, deleteId) {
    it('delete sku', function (done) {
        let SKU = { id: sku.id, description: sku.description, weight: sku.weight, volume: sku.volume, notes: sku.notes, availableQuantity: sku.availableQuantity, price: sku.price }
        agent.post('/api/sku').send(SKU).then(async function (res) {
            res.should.have.status(201);
            await agent.delete('/api/skus/' + deleteId).then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                done();
            });
        });
    });
}

function addNewSku(expectedHTTPStatus, id, description, weight, volume, notes, availableQuantity, price) {
    it('adding a new sku', function (done) {
        let sku = { id: id, description: description, weight: weight, volume: volume, notes: notes, availableQuantity: availableQuantity, price: price }
        agent.post('/api/sku').send(sku).then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            if (res = 201) {
                agent.get('/api/skus/' + id).then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    r.body.description.should.equal(description);
                    r.body.weight.should.equal(weight);
                    r.body.weight.should.equal(volume);
                    r.body.notes.should.equal(notes);
                    r.body.availableQuantity.should.equal(availableQuantity);
                });
            }
            done();
        });
    }
    )
};

function updatePositionOfSku(expectedHTTPStatus, sku, pos, position) {
    it('modify position of a sku', function (done) {
        let posToSet = { position: position };
        let SKU = { id: sku.id, description: sku.description, weight: sku.weight, volume: sku.volume, notes: sku.notes, availableQuantity: sku.availableQuantity, price: sku.price }
        agent.post('/api/position').send(pos).then(function (res) {
            res.should.have.status(201);
            agent.post('/api/sku').send(SKU).then(function (res1) {
                res1.should.have.status(201);
                agent.put('/api/sku/' + sku.id + '/position').send(posToSet).then(async function (res2) {
                    res2.should.have.status(expectedHTTPStatus);
                    if (res2.status == 200) {
                        await agent.get('/api/skus/' + sku.id).then(function (r) {
                            r.should.have.status(200);
                            r.body.position.should.equal(pos.positionID);
                        });
                    }
                    done();
                });
            });
        });
    });
}

function updateSku(expectedHTTPStatus, sku, newSku, skuId) {
    it('update sku info', function (done) {
        let SKU = { id: sku.id, description: sku.description, weight: sku.weight, volume: sku.volume, notes: sku.notes, availableQuantity: sku.availableQuantity, price: sku.price }
        agent.post('/api/sku').send(SKU).then(function (res) {
            res.should.have.status(201);
            agent.put('/api/sku/' + skuId).send(newSku).then(async function (res1) {
                res1.should.have.status(expectedHTTPStatus);
                if (res1.status == 200) {
                   await agent.get('/api/skus/' + skuId).then(function (r) {
                        r.should.have.status(200),
                            r.body.description.should.equal(newSku.newDescription);
                        r.body.weight.should.equal(newSku.newWeight);
                        r.body.volume.should.equal(newSku.newVolume);
                        r.body.notes.should.equal(newSku.newNotes);
                        r.body.price.should.equal(newSku.newPrice);
                        r.body.availableQuantity.should.equal(newSku.newAvailableQuantity);
                    });
                }
                done();
            });
        });
    });
}

function getSku(expectedHTTPStatus, id, description, weight, volume, notes, availableQuantity, price, selectedId) {
    it('get a sku from database', function (done) {
        let sku = { id: id, description: description, weight: weight, volume: volume, notes: notes, availableQuantity: availableQuantity, price: price };
        agent.post('/api/sku').send(sku).then(async function (res) {
            res.should.have.status(201);
            await agent.get('/api/skus/' + selectedId).then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status == 200) {
                    r.body.description.should.equal(description);
                    r.body.weight.should.equal(weight);
                    r.body.volume.should.equal(volume);
                    r.body.notes.should.equal(notes);
                    r.body.availableQuantity.should.equal(availableQuantity);
                }
                done();
            });
        });
    });
}

function getSkuList(expectedHTTPStatus, sku) {
    it('getting sku list from database', function (done) {
        let SKU = { id: sku.id, description: sku.description, weight: sku.weight, volume: sku.volume, notes: sku.notes, availableQuantity: sku.availableQuantity, price: sku.price }
        let SKU2 = { id: 2, description: "new test for sku", weight: 5, volume: 5, notes: "new sku", availableQuantity: 20, price: 2.99 };
        agent.post('/api/sku').send(SKU).then(function (res) {
            res.should.have.status(201);
            agent.post('/api/sku').send(SKU2).then(function (res2) {
                res2.should.have.status(201);
                agent.get('/api/skus').then(function (r) {
                    r.should.have.status(expectedHTTPStatus);
                    r.body.length.should.equal(2);
                    done();
                });
            });
        });
    });
}