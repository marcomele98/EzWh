const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const dayjs = require('dayjs')
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat);

const resDAO = require('../modules/database/restockOrderDAO');

describe('test restock order api', () => {

    beforeEach(async () => {
        await resDAO.deleteTableContent();
    })

    input = {
        "issueDate":"2021/11/29 09:33",
        "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
                    {"SKUId":180,"description":"another product","price":11.99,"qty":2}],
        "supplierId" : 1
    };


    badInput1 = {
        "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
                    {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
        "supplierId" : 1
    }

    badInput2 = {
        "issueDate":"2021/11/29 09:33",
        "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
                    {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
        "supplierId" : -2
    }

    badInput3 = {
        "issueDate":"2021/11/29 09:33",
        "products": [{"SKUId":-12,"description":"a product","price":10.99,"qty":3},
                    {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
        "supplierId" : 1
    }

    badInput4 = {
        "issueDate":"2021/11/29 09:33",
        "products": [{"SKUId":-12,"description":"a product","price":-10.99,"qty":3},
                    {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
        "supplierId" : 1
    }

    badInput5 = {
        "issueDate":"2021/11/29 09:33",
        "products": [{"SKUId":-12,"description":"a product","price":10.99,"qty":3},
                    {"SKUId":180,"description":"another product","price":11.99,"qty":-3}],
        "supplierId" : 1
    }

    modState = {
        "newState": "DELIVERED"
    }

    modState1 = {
        "newState": "aaa"
    }

    modSkuItems = {
        "skuItems" : [{"SKUId":12,"rfid":"12345678901234567890123456789016"},
        {"SKUId":12,"rfid":"12345678901234567890123456789017"},
        {"SKUId":12,"rfid":"12345678901234567890123456789020"},
        {"SKUId":180,"rfid":"12345678901234567890123456789021"},
        {"SKUId":180,"rfid":"12345678901234567890123456789022"},
        {"SKUId":180,"rfid":"12345678901234567890123456789023"}]
    }

    modSkuItems1 = {
        "skuItems" : [{"SKUId":-12,"rfid":"12345678901234567890123456789016"},
        {"SKUId":12,"rfid":"12345678901234567890123456789017"},
        {"SKUId":12,"rfid":"12345678901234567890123456789020"},
        {"SKUId":180,"rfid":"12345678901234567890123456789021"},
        {"SKUId":180,"rfid":"12345678901234567890123456789022"},
        {"SKUId":180,"rfid":"12345678901234567890123456789023"}]
    }

    modSkuItems2 = {
        "skuItems" : [{"SKUId":12,"rfid":"12345678901234567890123456789016"},
        {"SKUId":12,"rfid":"12345678901234567890123456789017111"},
        {"SKUId":12,"rfid":"12345678901234567890123456789020"},
        {"SKUId":180,"rfid":"12345678901234567890123456789021"},
        {"SKUId":180,"rfid":"12345678901234567890123456789022"},
        {"SKUId":180,"rfid":"12345678901234567890123456789023"}]
    }

    modTransportNote = {
        "transportNote":{"deliveryDate":"2021/12/29"}
    }

    modTransportNote1 = {
        "transportNote":{"deliveryDate":"2021/10/29"}
    }

    deleteRestockOrder(204, input, 1);
    deleteRestockOrder(422, input, -2); // invalid id
    
    newRestockOrder(201, input); // restockOrder created
    newRestockOrder(422, badInput1); // issue date undefined
    newRestockOrder(422, badInput2); // supplierId negative
    newRestockOrder(422, badInput3); // SKUId negative
    newRestockOrder(422, badInput4); // price negative
    newRestockOrder(422, badInput5); // qty negative
    
    modifyRestockOrderState(200, input, modState, 1); // delivered
    modifyRestockOrderState(422, input, modState1, 1); // wrong state
    modifyRestockOrderState(404, input, modState, 2); // restockOrder not found
    modifyRestockOrderState(422, input, modState, 'a'); // invalid id

    modifyRestockOrderSkuItems(200, input, modSkuItems, 1); // added sku items
    modifyRestockOrderSkuItems(422, input, modSkuItems1, 1); // invalid SkuID
    modifyRestockOrderSkuItems(422, input, modSkuItems2, 1); // invalid rfid too long
    modifyRestockOrderSkuItems(422, input, modSkuItems, 'a'); // invalid id
    modifyRestockOrderSkuItems(404, input, modSkuItems, 2); // restockOrder not found

    modifyRestockOrderTransportNote(200, input, modTransportNote, 1); // correct deliveryDate
    modifyRestockOrderTransportNote(422, input, modTransportNote1, 1); // deliveryDate before issueDate
    modifyRestockOrderTransportNote(422, input, modTransportNote,'a'); // invalid id
    modifyRestockOrderTransportNote(404, input, modTransportNote, 2); // restockOrder not found

    getListRestockOrders(200, input); // list restock orders
    getListRestockOrdersIssued(200, input, modState); // list issued restock orders
    getRestockOrder(200, input, modState, 1);
    getRestockOrder(404, input, modState, 2); // restock order not found
    getRestockOrder(422, input, modState, "a"); // invalid id
    getRestockOrderReturnItems(200, input, modSkuItems, 1);
    getRestockOrderReturnItems(422, input, modSkuItems, 'a'); // invalid id

});

function deleteRestockOrder(expectedHTTPStatus, input, deleteId) {
    it('delete restock order', function (done) {
        agent.post('/api/restockOrder')
            .send(input)
            .then(function (res) {
                res.should.have.status(201);
                agent.delete('/api/restockOrder/' + deleteId)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        done();
                    });
                });
    });
}


function newRestockOrder(expectedHTTPStatus, input) {
    it('adding a new restock order', function (done) {
        agent.post('/api/restockOrder')
            .send(input)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (res.status == 201) {
                    agent.get('/api/restockOrders/1')
                        .then(function (r) {
                            r.should.have.status(200);
                            r.body.id.should.equal(1);
                            r.body.issueDate.should.equal(input.issueDate);
                            r.body.products.length.should.equal(input.products.length);
                            r.body.state.should.equal('ISSUED');
                            r.body.supplierId.should.equal(input.supplierId);
                        });
                }
                done();
            });
    });
}

function modifyRestockOrderState(expectedHTTPStatus, input, mod, id) {
    it('modify restock order state', function (done) {
        agent.post('/api/restockOrder')
            .send(input)
            .then(function (res) {
                res.should.have.status(201);
                agent.put('/api/restockOrder/' + id)
                    .send(mod)
                    .then(function (re) {
                        re.should.have.status(expectedHTTPStatus)
                        if (re.status == 200) {
                            agent.get('/api/restockOrders/' + id)
                                .then(function (r1) {
                                    r1.should.have.status(200);
                                    r1.body.state.should.equal(mod.newState);
                                });
                        }
                        done();
                    });
            });
    });
}

function modifyRestockOrderSkuItems(expectedHTTPStatus, input, mod, id) {
    it('modify restock order skuitems', function (done) {
        agent.post('/api/restockOrder')
            .send(input)
            .then(function (res) {
                // res.should.have.status(201);
                agent.put('/api/restockOrder/1' )
                    .send({"newState":"DELIVERED"})
                    .then(function (ren) {
                        // ren.should,have.status(200);
                        agent.put('/api/restockOrder/' + id + '/skuItems')
                            .send(mod)
                            .then(function (re) {
                                re.should.have.status(expectedHTTPStatus)
                                if (re.status == 200) {
                                    agent.get('/api/restockOrders/' + id)
                                        .then(function (r1) {
                                            r1.should.have.status(200);
                                            r1.body.skuItems.length.should.equal(mod.skuItems.length);
                                        });
                                }
                                done();
                            });
                    });
            });
    });
}

function modifyRestockOrderTransportNote(expectedHTTPStatus, input, mod, id) {
    it('modify restock order transport note', function (done) {
        agent.post('/api/restockOrder')
            .send(input)
            .then(function (res) {
                res.should.have.status(201);
                agent.put('/api/restockOrder/' + id)
                    .send({"newState":"DELIVERY"})
                    .then(function (ren) {
                        agent.put('/api/restockOrder/' + id + '/transportNote')
                            .send(mod)
                            .then(function (re) {
                                re.should.have.status(expectedHTTPStatus)
                                if (re.status == 200) {
                                    agent.get('/api/restockOrders/' + id)
                                        .then(function (r1) {
                                            r1.should.have.status(200);
                                            r1.body.state.should.equal(mod.transportNote);
                                        });
                                }
                                done();
                            });
                    });
            });
    });
}

function getListRestockOrders(expectedHTTPStatus, input) {
    it('getting restock orders list', function (done) {
        agent.post('/api/restockOrder')
            .send(input)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/restockOrder')
                    .send(input)
                    .then(function (r) {
                        r.should.have.status(201);
                        agent.get('/api/restockOrders')
                            .then(function (r1) {
                                r1.should.have.status(expectedHTTPStatus);
                                r1.body.length.should.equal(2);
                                done();
                            })
                    });
            });
    });
}

function getListRestockOrdersIssued(expectedHTTPStatus, input, mod) {
    it('getting issued restock orders list', function (done) {
        agent.post('/api/restockOrder')
            .send(input)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/restockOrder')
                    .send(input)
                    .then(function (re) {
                        re.should.have.status(201);
                        agent.put('/api/restockOrder/1')
                            .send(mod)
                            .then(function (r) {
                                r.should.have.status(200);
                                agent.get('/api/restockOrdersIssued')
                                    .then(function (r1) {
                                        r1.should.have.status(expectedHTTPStatus);
                                        r1.body.length.should.equal(1);
                                        done();
                                    });
                            });
                    });
            });
    });
}

function getRestockOrder(expectedHTTPStatus, input, mod, id) {
    it('getting restock order by id', function (done) {
        agent.post('/api/restockOrder')
            .send(input)
            .then(function (res) {
                res.should.have.status(201);
                agent.put('/api/restockOrder/1')
                    .send(mod)
                    .then(function (r) {
                        r.should.have.status(200);
                        agent.get('/api/restockOrders/' + id)
                            .then(function (r1) {
                                if (r1.status == 200) {
                                    r1.should.have.status(expectedHTTPStatus);
                                    r1.body.id.should.equal(id);
                                    r1.body.issueDate.should.equal(input.issueDate);
                                    r1.body.supplierId.should.equal(input.supplierId);
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

function getRestockOrderReturnItems(expectedHTTPStatus, input, mod, id) {
    it('getting restock order return items', function (done) {
        agent.post('/api/restockOrder')
            .send(input)
            .then(function (res) {
                res.should.have.status(201);
                agent.put('/api/restockOrder/' + id)
                    .send({"newState":"DELIVERED"})
                    .then(function (ren) {
                        if (ren.status == 200) {
                        agent.put('/api/restockOrder/' + id + '/skuItems')
                            .send(mod)
                            .then(function (re2) {
                                if (re2.status == 200) {
                                        agent.get('/api/restockOrders/' + id)
                                                    .then(function (rtest) {
                                                        // console.log('its checking1 enter and its ' + id);
                                                        // console.log(rtest.body.skuItems);
                                                        rtest.should.have.status(200);
                                                        
                                                    })
                                    agent.put('/api/restockOrder/' + id)
                                        .send({"newState":"COMPLETEDRETURN"})
                                        .then(function (re) {
                                            
                                            agent.get('/api/restockOrders/' + id)
                                                    .then(function (rtest) {
                                                        // console.log('its checking2 enter and its ' + id);
                                                        // console.log(rtest.body.skuItems);
                                                        rtest.should.have.status(200);
                                                        
                                                    })


                                            if (re.status == 200) {
                                                console.log('its entering and its ' + id);
                                                agent.get('/api/restockOrders/' + id + '/returnItems')
                                                    .then(function (r1) {
                                                        // console.log('its entered');
                                                        r1.should.have.status(200);
                                                    })
                                            }
                                        done();
                                    });
                                }
                                else{
                                    re2.should.have.status(expectedHTTPStatus);
                                    done();
                                }
                            });
                        }
                        else{
                            ren.should.have.status(expectedHTTPStatus);
                            done();
                        }
                    });
            });
    });
}

