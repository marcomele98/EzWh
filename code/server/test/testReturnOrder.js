const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const dayjs = require('dayjs')
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat);

const resDAO = require('../modules/database/returnOrderDAO');

describe('test return order api', () => {

    beforeEach(async () => {
        await resDAO.deleteTableContent();
    })

    input = {
        "returnDate":"2021/11/29 09:33",
        "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                    {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
        "restockOrderId" : 1
    };


    badInput1 = {
        "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                    {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
        "restockOrderId" : 1
    }

    badInput2 = {
        "returnDate":"2021/11/29 09:33",
        "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                    {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
        "restockOrderId" : -1
    }

    badInput3 = {
        "returnDate":"2021/11/29 09:33",
        "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                    {"SKUId":-180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
        "restockOrderId" : 1
    }

    deleteReturnOrder(204, input, 1);
    deleteReturnOrder(404, input, 2); // return order not found
    deleteReturnOrder(422, input, -2); // invalid id
    
    newReturnOrder(201, input); // returnOrder created
    newReturnOrder(422, badInput1); // issue date undefined
    newReturnOrder(422, badInput2); // restockOrderId negative
    newReturnOrder(422, badInput3); // SKUId negative
    
    getListReturnOrders(200, input); // list return orders
    getReturnOrder(200, input, 1);
    getReturnOrder(404, input, 3); // return order not found
    getReturnOrder(422, input, "a"); // invalid id

});

function deleteReturnOrder(expectedHTTPStatus, input, deleteId) {
    it('delete return order', function (done) {
        agent.post('/api/returnOrder')
            .send(input)
            .then(function (res) {
                res.should.have.status(201);
                agent.delete('/api/returnOrder/' + deleteId)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        done();
                    });
            });
    });
}

function newReturnOrder(expectedHTTPStatus, input) {
    it('adding a new return order', function (done) {
        agent.post('/api/returnOrder')
            .send(input)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (res.status == 201) {
                    agent.get('/api/returnOrders/1')
                        .then(function (r) {
                            r.should.have.status(200);
                            r.body.id.should.equal(1);
                            r.body.returnDate.should.equal(input.returnDate);
                            r.body.products.length.should.equal(input.products.length);
                            r.body.restockOrderId.should.equal(input.restockOrderId);
                        })
                }
                done();
            }).catch(done);
    });
}

function getListReturnOrders(expectedHTTPStatus, input) {
    it('getting return orders list', function (done) {
        agent.post('/api/returnOrder')
            .send(input)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/returnOrder')
                    .send(input)
                    .then(function (r) {
                        r.should.have.status(201);
                        agent.get('/api/returnOrders')
                            .then(function (r1) {
                                r1.should.have.status(expectedHTTPStatus);
                                r1.body.length.should.equal(2);
                                done();
                            })
                    });
            });
    });
}

function getReturnOrder(expectedHTTPStatus, input, id) {
    it('getting return order', function (done) {
        agent.post('/api/returnOrder')
            .send(input)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/returnOrder')
                    .send(input)
                    .then(function (r) {
                        r.should.have.status(201);
                        agent.get('/api/returnOrders/' + id)
                            .then(function (r1) {
                                if (r1.status == 200) {
                                    r1.should.have.status(expectedHTTPStatus);
                                    r1.body.returnDate.should.equal(input.returnDate);
                                    r1.body.restockOrderId.should.equal(input.restockOrderId);
                                    done();
                                } else {
                                    r1.should.have.status(expectedHTTPStatus);
                                    done();
                                }
                            });
                    });
            });
    });
}