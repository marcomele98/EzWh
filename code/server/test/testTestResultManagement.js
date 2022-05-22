const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);
const skuDAO = require('../modules/database/skuDAO');
const testDescriptorDAO = require('../modules/database/test-descriptorDAO');
const testResultDAO = require('../modules/database/test-resultDAO');
const skuItemDAO = require('../modules/database/skuItemDAO');

describe('testResults apis', () => {
    beforeEach(async () => {
        // setup
        await skuItemDAO.deleteTableContent();
        await skuDAO.deleteTableContent();
        await testResultDAO.deleteTableContent();
        await testDescriptorDAO.deleteTableContent();
        // add sku, skuitem and testDescriptor
        await agent.post('/api/sku').send({
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        });
        await agent.post('/api/skuitem').send({
            "RFID":"12345678901234567890123456789015",
            "SKUId":1,
            "DateOfStock":"2021/11/29 12:30"
        });
        await agent.post('/api/testDescriptor').send({
            "name":"test descriptor 3",
            "procedureDescription":"This test is described by...",
            "idSKU" :1
        });
    });

    // get test result -- not existing rfid
    getTestResult('12345678901234567890123456789011',
        {
            "rfid":"12345678901234567890123456789015",
            "idTestDescriptor":1,
            "Date":"2021/11/28",
            "Result": true
        }, 404);
    // get test result -- wrong rfid format
    getTestResult('1234567890123457890123456789011',
        {
            "rfid":"12345678901234567890123456789015",
            "idTestDescriptor":1,
            "Date":"2021/11/28",
            "Result": true
        }, 422);
    getTestResult('12345678901234567890123456789015',
        {
            "rfid":"12345678901234567890123456789015",
            "idTestDescriptor":1,
            "Date":"2021/11/28",
            "Result": true
        }, 200);

    // add test result -- invalid rfid
    newTestResult({
        "rfid":"123456789012567890123456789015",
        "idTestDescriptor":1,
        "Date":"2021/11/28",
        "Result": true
    }, 422, '');
    // idTestDescriptor not in db
    newTestResult({
        "rfid":"12345678901234567890123456789015",
        "idTestDescriptor":12,
        "Date":"2021/11/28",
        "Result": true
    }, 404, '');
    // rfid not ind db
    newTestResult({
        "rfid":"12345678901634567890123456789015",
        "idTestDescriptor":1,
        "Date":"2021/11/28",
        "Result": true
    }, 404, '');
    // should work
    newTestResult({
        "rfid":"12345678901234567890123456789015",
        "idTestDescriptor":1,
        "Date":"2021/11/28",
        "Result": true
    }, 201, {
        "id":1,
        "idTestDescriptor":1,
        "Date":"2021/11/28",
        "Result": true
    });
});

function getTestResult(rfid, data, expectedHTTPStatus) {
    it('get a test result', async function () {
        await agent.post('/api/skuitems/testResult').send(data);
        let res = await agent.get('/api/skuitems/'+rfid+'/testResults');
        res.status.should.equal(expectedHTTPStatus);
        if(expectedHTTPStatus === 200){
            res.body.length.should.equal(1);
        }
    });
}

function newTestResult(data, expectedHTTPStatus, expectedData) {
    it('try adding a new test descriptor', async function () {
        let s = await agent.post('/api/skuitems/testResult').send(data);
        s.status.should.equal(expectedHTTPStatus);
        if(expectedHTTPStatus === 201){
            let res = await agent.get('/api/skuitems/'+data.rfid+'/testResults/'+'1');
            res.body.id.should.equal(expectedData.id);
            res.body.idTestDescriptor.should.equal(expectedData.idTestDescriptor);
            res.body.Date.should.equal(expectedData.Date);
            res.body.Result.should.equal(expectedData.Result);
        }
    });
}