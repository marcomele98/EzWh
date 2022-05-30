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

    // try to modify a test result -- should work
    modifyTestResult({
        "rfid":"12345678901234567890123456789015",
        "idTestDescriptor":1,
        "Date":"2021/11/28",
        "Result": true
    }, {
        "newIdTestDescriptor":1,
        "newDate":"2019/11/28",
        "newResult": false
    }, 200, {
        "id":1,
        "idTestDescriptor":1,
        "Date":"2019/11/28",
        "Result":false
    }, '12345678901234567890123456789015', 1);
    // try to modify a test result -- rfid is nan
    modifyTestResult({
        "rfid":"12345678901234567890123456789015",
        "idTestDescriptor":1,
        "Date":"2021/11/28",
        "Result": true
    }, {
        "newIdTestDescriptor":1,
        "newDate":"2019/11/28",
        "newResult": false
    }, 422, {
        "id":1,
        "idTestDescriptor":1,
        "Date":"2019/11/28",
        "Result":false
    }, '123456789a1234567890123456789015', 1);
    // try to modify a test result -- Result is not a boolean
    modifyTestResult({
        "rfid":"12345678901234567890123456789015",
        "idTestDescriptor":1,
        "Date":"2021/11/28",
        "Result": true
    }, {
        "newIdTestDescriptor":1,
        "newDate":"2019/11/28",
        "newResult": 54
    }, 422, {
        "id":1,
        "idTestDescriptor":1,
        "Date":"2019/11/28",
        "Result":false
    }, '12345678901234567890123456789015', 1);
    // try to modify a test result -- idtestdescriptor 100 does not exists
    modifyTestResult({
        "rfid":"12345678901234567890123456789015",
        "idTestDescriptor":1,
        "Date":"2021/11/28",
        "Result": true
    }, {
        "newIdTestDescriptor":100,
        "newDate":"2019/11/28",
        "newResult": false
    }, 404, {
        "id":1,
        "idTestDescriptor":1,
        "Date":"2019/11/28",
        "Result":false
    }, '12345678901234567890123456789015', 1);
    // try to modify a test result -- id 13 does not exists
    modifyTestResult({
        "rfid":"12345678901234567890123456789015",
        "idTestDescriptor":1,
        "Date":"2021/11/28",
        "Result": true
    }, {
        "newIdTestDescriptor":1,
        "newDate":"2019/11/28",
        "newResult": false
    }, 404, {
        "id":1,
        "idTestDescriptor":1,
        "Date":"2019/11/28",
        "Result":false
    }, '12345678901234567890123456789015', 13);
    // try to modify a test result -- rfid does not exists
    modifyTestResult({
        "rfid":"12345678901234567890123456789015",
        "idTestDescriptor":1,
        "Date":"2021/11/28",
        "Result": true
    }, {
        "newIdTestDescriptor":1,
        "newDate":"2019/11/28",
        "newResult": false
    }, 404, {
        "id":1,
        "idTestDescriptor":1,
        "Date":"2019/11/28",
        "Result":false
    }, '12345678901234567890123456781015', 1);

    // try to delete a test result -- should work
    deleteTestResult({
        "rfid":"12345678901234567890123456789015",
        "idTestDescriptor":1,
        "Date":"2021/11/28",
        "Result": true
    }, 204, 0, '12345678901234567890123456789015', 1);
    // try to delete a test result -- invalid rfid
    deleteTestResult({
        "rfid":"12345678901234567890123456789015",
        "idTestDescriptor":1,
        "Date":"2021/11/28",
        "Result": true
    }, 422, 1, '1234567890123456789013456789015', 1);
    // try to delete a test result -- invalid id
    deleteTestResult({
        "rfid":"12345678901234567890123456789015",
        "idTestDescriptor":1,
        "Date":"2021/11/28",
        "Result": true
    }, 422, 1, '12345678901234567890123456789015', 'as4');

    // add two test results
    twoTestResult({
        "rfid":"12345678901234567890123456789015",
        "idTestDescriptor":1,
        "Date":"2021/11/28",
        "Result": true
    }, {
        "rfid":"12345678901234567890123456789015",
        "idTestDescriptor":1,
        "Date":"2020/11/28",
        "Result": false
    }, '12345678901234567890123456789015');
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
    it('try adding a new test result', async function () {
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

function twoTestResult(data1, data2, rfid){
    it('try adding a new test result', async function () {
        await agent.post('/api/skuitems/testResult').send(data1);
        await agent.post('/api/skuitems/testResult').send(data2);
        let values = await agent.get('/api/skuitems/'+rfid+'/testResults');
        values.body[0].id.should.equal(1);
        values.body[1].id.should.equal(2);
    });
} 

function modifyTestResult(data, newData,expectedHTTPStatus, expectedData, rfid, id) {
    it('try to modify a test result', async function () {
        await agent.post('/api/skuitems/testResult').send(data);
        let moddifyAct = await agent.put('/api/skuitems/'+ rfid+'/testResult/'+id).send(newData);
        moddifyAct.status.should.equal(expectedHTTPStatus);
        if(expectedHTTPStatus === 200){
            let res = await agent.get('/api/skuitems/'+rfid+'/testResults/'+id);
            res.body.id.should.equal(expectedData.id);
            res.body.idTestDescriptor.should.equal(expectedData.idTestDescriptor);
            res.body.Date.should.equal(expectedData.Date);
            res.body.Result.should.equal(expectedData.Result);
        }
    });
}

function deleteTestResult(data, expectedHTTPStatus, expectedBodyLen, rfid, id) {
    it('try to delete a test result', async function () {
        await agent.post('/api/skuitems/testResult').send(data);
        let res = await agent.delete('/api/skuitems/'+rfid+'/testResult/'+id);
        res.status.should.equal(expectedHTTPStatus);
        if (expectedHTTPStatus === 204){
            let values = await agent.get('/api/skuitems/'+rfid+'/testResults');
            values.body.length.should.equal(expectedBodyLen); 
        }
    });
}