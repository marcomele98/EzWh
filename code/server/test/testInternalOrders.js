const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const dayjs = require('dayjs')
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat);

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
        "customerId": -2
    }

    mod = {
        "newState": "ACCEPTED"
    }

    mod1 = {
        "newState": "COMPLETED",
        "products": [{"SkuID":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
        {"SkuID":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789017"},
        {"SkuID":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789018"},
        {"SkuID":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"},
        {"SkuID":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789039"},
        {"SkuID":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789040"}]
    }

    mod2 = {
        "newState": "aaa",
        "products": [{"SkuID":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
        {"SkuID":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789017"},
        {"SkuID":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789018"},
        {"SkuID":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"},
        {"SkuID":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789039"},
        {"SkuID":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789040"}]
    }

    mod3 = {
        "newState": "COMPLETED",
        "products": [{"SkuID":-12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
        {"SkuID":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789017"},
        {"SkuID":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789018"},
        {"SkuID":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"},
        {"SkuID":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789039"},
        {"SkuID":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789040"}]
    }

    possibleType = ['ISSUED', 'ACCEPTED', 'REFUSED', 'CANCELED', 'COMPLETED'];

    intOrds = [
        {
            "id":1,
            "issueDate":"2021/11/29 09:33",
            "state": "ACCEPTED",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":2},
                        {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
            "customerId" : 1
        },
        {
            "id":2,
            "issueDate":"2021/11/30 19:33",
            "state": "COMPLETED",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789017"},
                        {"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789018"},
                        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"},
                        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789039"},
                        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789040"}],
            "customerId" : 1
        },
    ]


    deleteInternalOrder(204, io, 1);
    deleteInternalOrder(404, io, 2); // internal order not found
    deleteInternalOrder(422, io, -2); // invalid id
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
        if (io === undefined || io.issueDate === undefined || io.products === undefined || io.customerId === undefined
            || io == '' || io.issueDate === '' || io.products === '' || io.customerId === "" || io.customerId <= 0
            || isNaN(io.customerId) || !dayjs(io.issueDate, ['YYYY/MM/DD', 'YYYY/MM/DD hh:mm', 'YYYY/M/DD', 'YYYY/M/DD hh:mm', 'YYYY/MM/D', 'YYYY/MM/D hh:mm', 'YYYY/M/D', 'YYYY/M/D hh:mm'], true).isValid()) {
            agent.post('/api/internalOrders')
                .send(io)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        }
        else {
            var a = 0;
            for (var i = 0; i < io.products.length; i++) {
                if (io.products[i].SKUId == undefined || io.products[i].SKUId <= 0 || io.products[i].SKUId == '' || isNaN(io.products[i].SKUId)
                    || !isNaN(io.products[i].description) || io.products[i].description == undefined || io.products[i].description == '' || io.products[i].price <= 0 ||
                    io.products[i].price == undefined || io.products[i].price == '' || isNaN(io.products[i].price) ||
                    io.products[i].qty == undefined || io.products[i].qty <= 0 || io.products[i].qty == '' || isNaN(io.products[i].qty)
                ) {
                    a++;
                }
            }
            if (a > 0) {
                agent.post('/api/internalOrders')
                    .send(io)
                    .then(function (res) {
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    });
            }
            else {
                agent.post('/api/internalOrders')
                    .send(io)
                    .then(function (res) {
                        res.should.have.status(expectedHTTPStatus);
                        agent.get('/api/internalOrders/1')
                            .then(function (r) {
                                r.should.have.status(200);
                                r.body.id.should.equal(1);
                                r.body.issueDate.should.equal(io.issueDate);
                                r.body.products.length.should.equal(io.products.length);
                                // for (var i = 0; i < io.products.length; i++) {
                                //     r.body.products[i].SKUId.should.equal(io.products[i].SKUId);
                                //     r.body.products[i].description.should.equal(io.products[i].description);
                                //     r.body.products[i].price.should.equal(io.products[i].price);
                                //     r.body.products[i].qty.should.equal(io.products[i].qty);
                                // }
                                r.body.state.should.equal('ISSUED');
                                r.body.customerId.should.equal(io.customerId);
                                done();
                            })
                    });
            }
        }
    });
}

function modifyInternalOrder(expectedHTTPStatus, io, mod, possibleType, id) {
    it('modify internal order', function (done) {
        if (mod === undefined || mod.newState == undefined || !possibleType.includes(mod.newState)) {
            agent.post('/api/internalOrders')
                .send(io)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.put('/api/internalOrders/' + id)
                        .send(mod)
                        .then(function (r) {
                            r.should.have.status(expectedHTTPStatus);
                            done();
                        })
                });
        }
        else {
            var a = 0;
            if (mod.products !== undefined) {
                for (var i = 0; i < mod.products.length; i++) {
                    if (mod.products[i].SkuID == undefined || mod.products[i].SkuID <= 0 || mod.products[i].SkuID == '' || isNaN(mod.products[i].SkuID)
                        || mod.products[i].RFID == undefined || mod.products[i].RFID == '' || mod.products[i].RFID.length != 32 || isNaN(mod.products[i].RFID)) {
                        a++;
                    }
                }
                if (a > 0) {
                    agent.post('/api/internalOrders')
                        .send(io)
                        .then(function (res) {
                            res.should.have.status(201);
                            agent.put('/api/internalOrders/' + id)
                                .send(mod)
                                .then(function (r) {
                                    r.should.have.status(expectedHTTPStatus)
                                    done();
                                })
                        });
                } else {
                    agent.post('/api/internalOrders')
                        .send(io)
                        .then(function (res) {
                            res.should.have.status(201);
                            agent.put('/api/internalOrders/' + id)
                                .send(mod)
                                .then(function (re) {
                                    re.should.have.status(expectedHTTPStatus)
                                    if (re.status == 200) {
                                    agent.get('/api/internalOrders/'+id)
                                        .then(function (r1) {
                                            r1.should.have.status(200);
                                            r1.body.products.length.should.equal(mod.products.length);
                                            r1.body.state.should.equal(mod.newState);
                                            done();
                                        })
                                    } else {
                                        done();
                                    }
                                });
                        });
                }

            } else { 
                agent.post('/api/internalOrders')
                    .send(io)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.put('/api/internalOrders/' + id)
                            .send(mod)
                            .then(function (r) {
                                r.should.have.status(expectedHTTPStatus)
                                if(r.status == 200) {
                                agent.get('/api/internalOrders/1')
                                    .then(function (r1) {
                                        r1.should.have.status(200);
                                        r1.body.id.should.equal(1);
                                        r1.body.state.should.equal(mod.newState);
                                        done();
                                    })
                                }
                                else {
                                done();
                                }
                            });
                    });
            }
        }
    });
}

