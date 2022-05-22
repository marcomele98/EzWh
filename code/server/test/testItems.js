const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const itemDAO = require('../modules/database/itemDAO');
const skuDAO = require('../modules/database/skuDAO');


describe('test item apis', () => {

    sku = {
        "description": "a new sku",
        "weight": 100,
        "volume": 50,
        "notes": "first SKU",
        "price": 10.99,
        "availableQuantity": 50
    }

    beforeEach(async () => {
        await itemDAO.deleteTableContent();
        await skuDAO.deleteTableContent();
    });

    mod = { "newDescription": "a new item mod", "newPrice": 12.99 }
    mod1 = { "newDescription": "a new item mod" }
    mod2 = { "newPrice": 12.99 }

    deleteItem(204, 1, 'a new item', 10.99, 1, 1, 1, sku);
    deleteItem(422, 1, 'a new item', 10.99, 1, 1, -5, sku); // invalid id to delete
    deleteItem(404, 1, 'a new item', 10.99, 1, 1, 4, sku); // item not found 
    newItem(201, 1, 'a new item', 10.99, 1, 1, sku);
    newItem(422, 2, "a new item 2", 10.99, -5, 1, sku); // invalid SKUId (negative)
    newItem(422, -2, "a new item 3", 10.99, 5, 1, sku); // invalid id (negative)
    newItem(404, 2, "a new item 3", 10.99, 3, 1, sku); // Sku not found (sku with SKUId = 2 not in the database)
    newItemWrong(503, 1, 'a new item', 10.99, 1, 1, sku); // primary key(id, supplierId) alredy exists
    getItem(200, 1, 'a new item', 10.99, 1, 1, sku);
    getItemWrongId(422, 1, 'a new item', 10.99, 1, 1, "a", sku); // item id wrong
    getItemWrongId(404, 1, 'a new item', 10.99, 1, 1, 2, sku); // item not found
    getItemList(200, 1, 'a new item', 10.99, 1, 1, sku);
    modifyItem(200, 1, 'a new item', 10.99, 1, 1, mod, 1, sku);
    modifyItem(200, 1, 'a new item', 10.99, 1, 1, mod1, 1, sku); // no newPrice
    modifyItem(200, 1, 'a new item', 10.99, 1, 1, mod2, 1, sku); // no newDescription
    modifyItemWrong(404, 1, 'a new item', 10.99, 1, 1, mod, 4, sku); //item not found
    modifyItemWrong(422, 1, 'a new item', 10.99, 1, 1, mod, -4, sku); //invalid id
});

function deleteItem(expectedHTTPStatus, id, description, price, SKUId, supplierId, deleteId, sku) {
    it('delete item', function (done) {
        let item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId }
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/sku')
                    .send(sku)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.post('/api/item')
                            .send(item)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.delete('/api/items/' + deleteId)
                                    .then(function (r) {
                                        r.should.have.status(expectedHTTPStatus);
                                        done();
                                    });
                            });
                    });
            });
    });
}

function newItem(expectedHTTPStatus, id, description, price, SKUId, supplierId, sku) {
    it('adding a new item', function (done) {
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/sku')
                    .send(sku)
                    .then(function (res) {
                        res.should.have.status(201);
                    });
            });
        if (description !== '' || isNaN(description)
            || price > 0 || price !== undefined || !isNaN(price) || price !== '' || supplierId > 0
            || supplierId !== undefined || supplierId !== '' || !isNaN(supplierId) || id > 0 || id !== undefined
            || id !== '' || !isNaN(id) || SKUId > 0 || !isNaN(SKUId) || SKUId !== '' || SKUId !== undefined) {
            let item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId }
            agent.post('/api/item')
                .send(item)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else if (description == '' || !isNaN(description)
            || price <= 0 || price == undefined || isNaN(price) || price == '' || supplierId <= 0
            || supplierId == undefined || supplierId == '' || isNaN(supplierId) || id < 0 || id == undefined
            || id == '' || isNaN(id) || SKUId <= 0 || isNaN(SKUId) || SKUId == '' || SKUId == undefined) {
            agent.post('/api/item') 
                .send(item)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }

    });
}

function newItemWrong(expectedHTTPStatus, id, description, price, SKUId, supplierId, sku) {
    it('adding a new item wrong', function (done) {
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/sku')
                    .send(sku)
                    .then(function (res) {
                        res.should.have.status(201);
                    });
            });
        let item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId }
        let item2 = { id: 1, description: 'a new item', price: 10.99, SKUId: 2, supplierId: 1 }
        agent.post('/api/item') //we are not sending any data
            .send(item)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/item') //we are not sending any data
                    .send(item2)
                    .then(function (res2) {
                        res2.should.have.status(expectedHTTPStatus);
                        done();
                    });
            });
    });
}


function getItem(expectedHTTPStatus, id, description, price, SKUId, supplierId, sku) {
    it('getting item data from the system', function (done) {
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/sku')
                    .send(sku)
                    .then(function (res) {
                        res.should.have.status(201);
                    });
            });
        let item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId }
        agent.post('/api/item')
            .send(item)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/items/' + id)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.description.should.equal(description);
                        r.body.price.should.equal(price);
                        r.body.SKUId.should.equal(SKUId);
                        r.body.supplierId.should.equal(supplierId);
                        done();
                    });
            });
    });
}

function getItemWrongId(expectedHTTPStatus, id, description, price, SKUId, supplierId, wrongId, sku) {
    it('getting item with wrong id from the system', function (done) {
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/sku')
                    .send(sku)
                    .then(function (res) {
                        res.should.have.status(201);
                    });
            });
        let item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId }
        agent.post('/api/item')
            .send(item)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/items/' + wrongId)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        done();
                    });
            });
    });
}

function getItemList(expectedHTTPStatus, id, description, price, SKUId, supplierId, sku) {
    it('getting item list from the system', function (done) {
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/sku')
                    .send(sku)
                    .then(function (res) {
                        res.should.have.status(201);
                    });
            });
        let item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId }
        let item2 = { id: 2, description: 'a new item 2', price: 12.99, SKUId: 2, supplierId: 3 }
        agent.post('/api/item')
            .send(item)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/item')
                    .send(item2)
                    .then(function (res2) {
                        res2.should.have.status(201);
                        agent.get('/api/items')
                            .then(function (r) {
                                r.should.have.status(expectedHTTPStatus);
                                done();
                            });
                    });
            });
    });
}

function modifyItem(expectedHTTPStatus, id, description, price, SKUId, supplierId, mod, modifyId, sku) {
    it('modify item data from the system', function (done) {
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/sku')
                    .send(sku)
                    .then(function (res) {
                        res.should.have.status(201);
                    });
            });
        let item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId }
        if (mod.newDescription == undefined) {
            agent.post('/api/item')
                .send(item)
                .then(function (res1) {
                    res1.should.have.status(201);
                    agent.put('/api/item/' + modifyId)
                        .send(mod)
                        .then(function (res2) {
                            res2.should.have.status(200);
                            agent.get('/api/items/' + modifyId)
                                .then(function (r) {
                                    r.should.have.status(expectedHTTPStatus);
                                    r.body.price.should.equal(mod.newPrice);
                                    r.body.SKUId.should.equal(SKUId);
                                    r.body.supplierId.should.equal(supplierId);
                                    done();
                                });
                        });
                });

        }
        else if (mod.newPrice == undefined) {
            agent.post('/api/item')
                .send(item)
                .then(function (res1) {
                    res1.should.have.status(201);
                    agent.put('/api/item/' + modifyId)
                        .send(mod)
                        .then(function (res3) {
                            res3.should.have.status(200);
                            agent.get('/api/items/' + modifyId)
                                .then(function (r) {
                                    r.should.have.status(expectedHTTPStatus);
                                    r.body.description.should.equal(mod.newDescription);
                                    r.body.SKUId.should.equal(SKUId);
                                    r.body.supplierId.should.equal(supplierId);
                                    done();
                                });
                        });
                });
        }
        else {
            agent.post('/api/item')
                .send(item)
                .then(function (res1) {
                    res1.should.have.status(201);
                    agent.put('/api/item/' + modifyId)
                        .send(mod)
                        .then(function (res2) {
                            res2.should.have.status(200);
                            agent.get('/api/items/' + modifyId)
                                .then(function (r) {
                                    r.should.have.status(expectedHTTPStatus);
                                    r.body.description.should.equal(mod.newDescription);
                                    r.body.price.should.equal(mod.newPrice);
                                    r.body.SKUId.should.equal(SKUId);
                                    r.body.supplierId.should.equal(supplierId);
                                    done();
                                });
                        });
                });
        }
    });
}


function modifyItemWrong(expectedHTTPStatus, id, description, price, SKUId, supplierId, mod, modifyId, sku) {
    it('modify item wrong from the system', function (done) {
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/sku')
                    .send(sku)
                    .then(function (res) {
                        res.should.have.status(201);
                    });
            });
        let item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId }
        agent.post('/api/item')
            .send(item)
            .then(function (res) {
                res.should.have.status(201);
                agent.put('/api/item/' + modifyId)
                    .send(mod)
                    .then(function (res2) {
                        res2.should.have.status(expectedHTTPStatus);
                        done();
                    });
            });
    });
}