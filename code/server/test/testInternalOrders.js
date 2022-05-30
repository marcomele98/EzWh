const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);


const ioDAO = require('../modules/database/internalOrderDAO');

describe('test internal order apis', () => {

    beforeEach(async () => {
        await ioDAO.deleteTableContent();
    })

    io = {
        "issueDate": "2021/11/29 09:33",
        "products": [{ SKUId: 12, description: "a product", price: 10.99, qty: 3 },
        { SKUId: 180, description: "another product", price: 11.99, qty: 3 }],
        "customerId": 1
    }

    ioWrong = {
        "products": [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 3 },
        { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 3 }],
        "customerId": 1
    }

    ioWrong2 = {
        "issueDate": "2021/11/29 09:33",
        "products": [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 3 },
        { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 3 }],
        "customerId": -2
    }

    ioWrong3 = {
        "issueDate": "2021/11/29 09:33",
        "products": [{ "SKUId": -12, "description": "a product", "price": 10.99, "qty": 3 },
        { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 3 }],
        "customerId": 2
    }


    mod = {
        "newState": "ACCEPTED"
    }

    mod1 = {
        "newState": "COMPLETED",
        "products": [{ "SkuID": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
        { "SkuID": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789017" },
        { "SkuID": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789018" },
        { "SkuID": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" },
        { "SkuID": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789039" },
        { "SkuID": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789040" }]
    }

    mod2 = {
        "newState": "aaa",
        "products": [{ "SkuID": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
        { "SkuID": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789017" },
        { "SkuID": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789018" },
        { "SkuID": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" },
        { "SkuID": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789039" },
        { "SkuID": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789040" }]
    }

    mod3 = {
        "newState": "COMPLETED",
        "products": [{ "SkuID": -12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
        { "SkuID": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789017" },
        { "SkuID": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789018" },
        { "SkuID": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" },
        { "SkuID": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789039" },
        { "SkuID": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789040" }]
    }

    possibleType = ['ISSUED', 'ACCEPTED', 'REFUSED', 'CANCELED', 'COMPLETED'];

    intOrds = [
        {
            "id": 1,
            "issueDate": "2021/11/29 09:33",
            "state": "ACCEPTED",
            "products": [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 2 },
            { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 3 }],
            "customerId": 1
        },
        {
            "id": 2,
            "issueDate": "2021/11/30 19:33",
            "state": "COMPLETED",
            "products": [{ "SKUId": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
            { "SKUId": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789017" },
            { "SKUId": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789018" },
            { "SKUId": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" },
            { "SKUId": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789039" },
            { "SKUId": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789040" }],
            "customerId": 1
        },
    ]

    newInternalOrder(201, io); // internalOrder created
    newInternalOrder(422, ioWrong); // issue date undefined
    newInternalOrder(422, ioWrong2); // customerId negative
    newInternalOrder(422, ioWrong3); // SKUId negative
    modifyInternalOrder(200, io, mod, possibleType, 1); // state accepted
    modifyInternalOrder(200, io, mod1, possibleType, 1); // state completed with skuitems
    modifyInternalOrder(422, io, mod2, possibleType, 1); // invalid newState
    modifyInternalOrder(422, io, mod3, possibleType, 1); // invalid SkuID
    modifyInternalOrder(404, io, mod, possibleType, 2); // internalOrder not found
    modifyInternalOrder(404, io, mod1, possibleType, 2); // internalOrder not found
    getListInternalOrders(200, io, mod, 1); // state accepted
    getListInternalOrders(200, io, mod1, 1); // state completed with skuItems
    getListInternalOrdersIssued(200, io); // list issued internal orders
    getListInternalOrdersAccepted(200, io, mod) // list accepted internal orders
    getInternalOrder(200, io, mod, 1)
    getInternalOrder(200, io, mod1, 1)
    getInternalOrder(404, io, mod, 2) // internal order not found
    getInternalOrder(422, io, mod, "a") // invalid id
    deleteInternalOrder(404, io, 2); // internal order not found
    deleteInternalOrder(422, io, -2); // invalid id
    deleteInternalOrder(204, io, 1);
});

function deleteInternalOrder(expectedHTTPStatus, io, deleteId) {
    it('delete internal order', function (done) {
        agent.post('/api/internalOrders')
            .send(io)
            .then(function (res) {
                res.should.have.status(201);
                agent.delete('/api/internalOrders/' + deleteId)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        done();
                    });
            });
    });
}


function newInternalOrder(expectedHTTPStatus, io) {
    it('adding a new internal order', function (done) {
        agent.post('/api/internalOrders')
            .send(io)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (res.status == 201) {
                    agent.get('/api/internalOrders/1')
                        .then(function (r) {
                            r.should.have.status(200);
                            r.body.id.should.equal(1);
                            r.body.issueDate.should.equal(io.issueDate);
                            r.body.products.length.should.equal(io.products.length);
                            r.body.state.should.equal('ISSUED');
                            r.body.customerId.should.equal(io.customerId);
                        })
                }
                done();
            });
    });
}

function modifyInternalOrder(expectedHTTPStatus, io, mod, possibleType, id) {
    it('modify internal order', function (done) {
        agent.post('/api/internalOrders')
            .send(io)
            .then(function (res) {
                res.should.have.status(201);
                agent.put('/api/internalOrders/' + id)
                    .send(mod)
                    .then(function (re) {
                        re.should.have.status(expectedHTTPStatus)
                        if (re.status == 200) {
                            agent.get('/api/internalOrders/' + id)
                                .then(function (r1) {
                                    r1.should.have.status(200);
                                    r1.body.state.should.equal(mod.newState);
                                    if (mod.products != undefined) {
                                        r1.body.products.length.should.equal(mod.products.length);
                                    }
                                })
                        }
                        done();
                    });
            });
    });
}


function getListInternalOrders(expectedHTTPStatus, io, mod, id) {
    it('getting internal orders list', function (done) {
        agent.post('/api/internalOrders')
            .send(io)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/internalOrders')
                    .send(io)
                    .then(function (re) {
                        re.should.have.status(201);
                        agent.put('/api/internalOrders/' + id)
                            .send(mod)
                            .then(function (r) {
                                r.should.have.status(200);
                                agent.get('/api/internalOrders')
                                    .then(function (r1) {
                                        r1.should.have.status(expectedHTTPStatus);
                                        r1.body.length.should.equal(2);
                                        for (var i = 0; i < r1.body.length; i++) {
                                            if (r1.body[i].state == 'COMPLETED') {
                                                r1.body[i].products.length.should.equal(mod.products.length);
                                            } else {
                                                r1.body[i].products.length.should.equal(io.products.length);
                                            }
                                        }
                                        done();
                                    })
                            })
                    });
            });
    });
}

function getListInternalOrdersIssued(expectedHTTPStatus, io) {
    it('getting issued internal orders list', function (done) {
        agent.post('/api/internalOrders')
            .send(io)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/internalOrders')
                    .send(io)
                    .then(function (re) {
                        re.should.have.status(201);
                        agent.get('/api/internalOrdersIssued')
                            .then(function (r1) {
                                r1.should.have.status(expectedHTTPStatus);
                                r1.body.length.should.equal(2);
                                for (var i = 0; i < r1.body.length; i++) {
                                    r1.body[i].state.should.equal('ISSUED');
                                    r1.body[i].products.length.should.equal(io.products.length);
                                }
                                done();
                            })
                    })
            });
    });
}


function getListInternalOrdersAccepted(expectedHTTPStatus, io, mod) {
    it('getting accepted internal orders list', function (done) {
        agent.post('/api/internalOrders')
            .send(io)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/internalOrders')
                    .send(io)
                    .then(function (re) {
                        re.should.have.status(201);
                        agent.put('/api/internalOrders/1')
                            .send(mod)
                            .then(function (r) {
                                r.should.have.status(200);
                                agent.put('/api/internalOrders/2')
                                    .send(mod)
                                    .then(function (r) {
                                        r.should.have.status(200);
                                        agent.get('/api/internalOrdersAccepted')
                                            .then(function (r1) {
                                                r1.should.have.status(expectedHTTPStatus);
                                                r1.body.length.should.equal(2);
                                                for (var i = 0; i < r1.body.length; i++) {
                                                    r1.body[i].state.should.equal('ACCEPTED');
                                                    r1.body[i].products.length.should.equal(io.products.length);
                                                }
                                                done();
                                            })
                                    })
                            });
                    });
            });
    });
}


function getInternalOrder(expectedHTTPStatus, io, mod, id) {
    it('getting internal order by id', function (done) {
        agent.post('/api/internalOrders')
            .send(io)
            .then(function (res) {
                res.should.have.status(201);
                agent.put('/api/internalOrders/1')
                    .send(mod)
                    .then(function (r) {
                        r.should.have.status(200);
                        agent.get('/api/internalOrders/' + id)
                            .then(function (r1) {
                                if (r1.status == 200) {
                                    r1.should.have.status(expectedHTTPStatus);
                                    r1.body.id.should.equal(id);
                                    r1.body.issueDate.should.equal(io.issueDate);
                                    if (r1.body.state == 'COMPLETED') {
                                        r1.body.products.length.should.equal(mod.products.length);
                                    } else {
                                        r1.body.products.length.should.equal(io.products.length);
                                    }
                                    r1.body.customerId.should.equal(io.customerId)
                                    done();
                                } else {
                                    r1.should.have.status(expectedHTTPStatus);
                                    done();
                                }
                            })
                    })
            });
    });
}