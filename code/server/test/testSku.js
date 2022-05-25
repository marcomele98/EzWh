const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const skuDAO = require('../modules/database/skuDAO');
const positionDAO = require('../modules/database/positionDAO');
const testDescriptorDAO = require('../modules/database/test-descriptorDAO');

describe('test sku APIs', () => {

    beforeEach(async () => {
        await skuDAO.deleteTableContent();
        await skuDAO.resetTable();
        await positionDAO.deleteTableContent();
        await testDescriptorDAO.deleteTableContent();
    })

    pos = {
        "positionID": "800234543412",
        "aisleID": "8002",
        "row": "3454",
        "col": "3412",
        "maxWeight": 1000,
        "maxVolume": 1000,
    }
    pos2 = {
        "positionID": "900234543412",
        "aisleID": "9002",
        "row": "3454",
        "col": "3412",
        "maxWeight": 1000,
        "maxVolume": 1000,

    }

    newSku = {
        "newDescription": "a new sku",
        "newWeight": 20,
        "newVolume": 10,
        "newNotes": "first SKU",
        "newPrice": 10.99,
        "newAvailableQuantity": 10,
    }
    newSku2 = {

        "newWeight": 20,
        "newVolume": 10,
        "newNotes": "first SKU",
        "newPrice": 10.99,
        "newAvailableQuantity": 10,
    }
    newSku3 = {
        "newDescription": "a new sku",
        "newVolume": 10,
        "newNotes": "first SKU",
        "newPrice": 10.99,
        "newAvailableQuantity": 10,
    }
    newsku4 = {
        "newDescription": "a new sku",
        "newWeight": 20,
        "newNotes": "first SKU",
        "newPrice": 10.99,
        "newAvailableQuantity": 10,
    }

    newSku5 = {
        "newDescription": "a new sku",
        "newWeight": 20,
        "newVolume": 10,
        "newAvailableQuantity": 10,
    }

    newSkuWrong = {
        "newDescription": "a new sku",
        "newWeight": -4,
        "newVolume": 10,
        "newNotes": "first SKU",
        "newPrice": 10.99,
        "newAvailableQuantity": 10,
    }
    sku = {
        "description": "a new sku",
        "weight": 10,
        "volume": 10,
        "notes": "first order",
        "availableQuantity": 10,
        "price": 20.00,
    }

    sku3 = {
        "description": "a new sku 3",
        "weight": 12,
        "volume": 14,
        "notes": "third order",
        "availableQuantity": 20,
        "price": 20.00,
    }
    addNewSku(201, 1, "prova", 10, 10, "test", 20, 4.99); //correct data
    addNewSku(422, 2, 1241, 10, 10, "test", 20, 4.99); //wrong description
    updatePositionOfSku(404, sku, pos, "800234543412", 2); //no sku existing
    updatePositionOfSku(200, sku, pos, "800234543412", 1);
    updatePositionOfSku(422, sku, pos, "800234543412", "test"); //wrong id of SKU
    updateSku(200, sku, newSku, 1);
    updateSku(200, sku, newSku2, 1);
    updateSku(200, sku, newSku3, 1);
    updateSku(200, sku, newsku4, 1);
    updateSku(200, sku, newSku5, 1);
    updateSku(422, sku, newSkuWrong, 1);
    updateSku(422, sku, newSku, "test"); //invalid ID
    getSku(200, sku, 1);
    getSku(404, sku, 4);
    getSku(422, sku3, "ciao");
    getSkuList(200, sku);
    deleteSku(204, sku, 1);
    deleteSku(422, sku, "ciao"); //invalid Id of SKU
});

function deleteSku(expectedHTTPStatus, sku, deleteId) {
    it('delete sku', function (done) {
        let SKU = { description: sku.description, weight: sku.weight, volume: sku.volume, notes: sku.notes, price: sku.price, availableQuantity: sku.availableQuantity }
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
        let sku = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity }
        agent.post('/api/sku').send(sku).then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            if (res = 201) {
                agent.get('/api/skus/' + id).then(function (r) {
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

function updatePositionOfSku(expectedHTTPStatus, sku, pos, position, id) {
    it('modify position of a sku', function (done) {
        let posToSet = { position: position };
        let SKU = { description: sku.description, weight: sku.weight, volume: sku.volume, notes: sku.notes, price: sku.price, availableQuantity: sku.availableQuantity }
        agent.post('/api/position').send(pos).then(function (res) {
            res.should.have.status(201);
            agent.post('/api/sku').send(SKU).then(function (res1) {
                res1.should.have.status(201);
                agent.put('/api/sku/' + id + '/position').send(posToSet).then(function (res2) {
                    res2.should.have.status(expectedHTTPStatus);
                    if (res2.status == 200) {
                        agent.get('/api/skus/' + id).then(function (r) {
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
        agent.post('/api/sku').send(sku).then(function (res) {
            res.should.have.status(201);
            agent.put('/api/sku/' + skuId).send(newSku).then(function (res1) {
                ;
                res1.should.have.status(expectedHTTPStatus);
                if (res1.status == 200) {
                    agent.get('/api/skus/' + skuId).then(function (r) {
                        r.should.have.status(200);
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

function getSku(expectedHTTPStatus, sku, selectedId) {
    it('get a sku from database', function (done) {

        agent.post('/api/sku').send(sku).then(function (res) {
            res.should.have.status(201);
            agent.get('/api/skus/' + selectedId).then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status == 200) {
                    r.body.description.should.equal(sku.description);
                    r.body.weight.should.equal(sku.weight);
                    r.body.volume.should.equal(sku.volume);
                    r.body.notes.should.equal(sku.notes);
                    r.body.availableQuantity.should.equal(sku.availableQuantity);
                    r.body.price.should.equal(sku.price);
                }
                done();
            });
        });
    });
}


function getSkuList(expectedHTTPStatus, sku) {
    it('getting sku list from database', function (done) {
        let SKU = { id: sku.id, description: sku.description, weight: sku.weight, volume: sku.volume, notes: sku.notes, price: sku.price, availableQuantity: sku.availableQuantity }
        let SKU2 = { id: 4, description: "new test for sku", weight: 5, volume: 5, notes: "new sku", price: 2.99, availableQuantity: 20 };
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
