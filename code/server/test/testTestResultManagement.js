const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('testResults apis', () => {
    const rfid = '12345678901234567890123456789016';
    // beforeEach(async () => {
    //     await agent.delete('/api/testDescriptor');
    //     await agent.delete('/api/skus');
    //     await agent.delete('/api/skuitems/');
    //     await agent.delete('/api/skuitems/testResult');
    // })

    // check db is empty
    checkTests(404);
    // try to add a new test result -- will fail: no idTestDescriptor nor rfid
    newTestResult(404, {
        "rfid":"12345678901234567890123456789016",
        "idTestDescriptor":12,
        "Date":"2021/11/28",
        "Result": true
    });
    newTestResult(422, {
        "rfid":"12345678901234556789016",
        "idTestDescriptor":12,
        "Date":"2021/11/28",
        "Result": true 
    })
    // add sku, skuitem and testDescriptor
    agent.post('/api/sku').send({
        "description" : "a new sku",
        "weight" : 100,
        "volume" : 50,
        "notes" : "first SKU",
        "price" : 10.99,
        "availableQuantity" : 50
    });
    agent.post('/api/skuitem').send({
        "RFID":"12345678901234567890123456789015",
        "SKUId":1,
        "DateOfStock":"2021/11/29 12:30"
    });
    agent.post('/api/testDescriptor').send({
        "name":"test descriptor 3",
        "procedureDescription":"This test is described by...",
        "idSKU" :1
    });

    newTestResult(200, {
        "rfid":"12345678901234567890123456789015",
        "idTestDescriptor":0,
        "Date":"2021/11/28",
        "Result": true
    });
    
});

function checkTests(expectedHTTPStatus){
    it('checking if db has n tuples', function (done) {
        agent.get('/api/skuitems/12345678901234567890123456789015/testResults')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

function newTestResult(expectedHTTPStatus, data) {
    it('adding a new test result', function (done) {
        agent.post('/api/skuitems/testResult')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        });
}