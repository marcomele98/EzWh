const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);
const skuDAO = require('../modules/database/skuDAO');
const testDescriptorDAO = require('../modules/database/test-descriptorDAO');

describe('testDescriptor apis', () => {
    // Delete content table
    beforeEach(async () => {
        await skuDAO.deleteTableContent();
        await testDescriptorDAO.deleteTableContent();
        // Insert a SKU in DB
        await agent.post('/api/sku').send({
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        });
    })

    // Try to insert a test descriptor not associated to any skuid
    newTestDescr({
        "name":"test descriptor 3",
        "procedureDescription":"This test is described by...",
        "idSKU" :45
    }, 404, 0);
    // Try to insert wrong data
    newTestDescr({
        "name":"test descriptor 3",
        "procedureDescription":"This test is described by...",
        "idSKU" :"abc3223"
    }, 422, 0);
    // insert data -- should work
    newTestDescr({
        "name":"test descriptor 3",
        "procedureDescription":"This test is described by...",
        "idSKU" :1
    }, 201, 1);

    // get a test result -- no id 0
    getTestDescr(0, {
        "name":"test descriptor 3",
        "procedureDescription":"This test is described by...",
        "idSKU" :1
    }, 404, '');
    // get a test result -- id NaN
    getTestDescr('ssd', {
        "name":"test descriptor 3",
        "procedureDescription":"This test is described by...",
        "idSKU" :1
    }, 422, '');
    // should work
    getTestDescr(1, {
        "name":"test descriptor 3",
        "procedureDescription":"This test is described by...",
        "idSKU" :1
    }, 200, {
        "id":1,
        "name":"test descriptor 3",
        "procedureDescription": "This test is described by...",
        "idSKU" :1
    });

    // try to modify test descriptor -- should fail for id (34 not exists)
    modifyTestDescriotor({
        "name":"test descriptor 3",
        "procedureDescription":"This test is described by...",
        "idSKU" :1
    }, 
    {
        "newName":"test descriptor 1",
        "newProcedureDescription":"This test is described by...",
        "newIdSKU" :1
    }, 34, 404, '');

    // try to modify test descriptor -- should fail for idSKU (34 not exists)
    modifyTestDescriotor({
        "name":"test descriptor 3",
        "procedureDescription":"This test is described by...",
        "idSKU" :1
    },
    {
        "newName":"test descriptor 1",
        "newProcedureDescription":"This test is described by...",
        "newIdSKU" :34
    }, 1, 404, '');

    // try to modify test descriptor -- should fail for idSKU (NaN)
    modifyTestDescriotor({
        "name":"test descriptor 3",
        "procedureDescription":"This test is described by...",
        "idSKU" :1
    },
    {
        "newName":"test descriptor 1",
        "newProcedureDescription":"This test is described by...",
        "newIdSKU" :"assdf4555"
    }, 1, 422, '');

    modifyTestDescriotor({
        "name":"test descriptor 3",
        "procedureDescription":"This test is described by...",
        "idSKU" :1
    },
    {
        "newName":"test descriptor 1",
        "newProcedureDescription":"prova",
        "newIdSKU" :"1"
    }, 1, 200, {
        "id": 1,
        "name":"test descriptor 1",
        "procedureDescription":"prova",
        "idSKU" :1
    });

    // try to delete a test descr-- should fail (id NaN)
    deleteTestDescriptor("af4", {
        "name":"test descriptor 3",
        "procedureDescription":"This test is described by...",
        "idSKU" :1
    }, 422, 1);
    // try to delete a test descr-- should work
    deleteTestDescriptor(1, {
        "name":"test descriptor 3",
        "procedureDescription":"This test is described by...",
        "idSKU" :1
    }, 204, 0);
});

function newTestDescr(data, expectedHTTPStatus, expectedBodyLen) {
    it('try adding a new test descriptor', async function () {
        let s = await agent.post('/api/testDescriptor').send(data);
        s.status.should.equal(expectedHTTPStatus);
        let res = await agent.get('/api/testDescriptors');
        res.status.should.equal(200);
        res.body.length.should.equal(expectedBodyLen);
    });
}

function modifyTestDescriotor(data, newData, id, expectedHTTPStatus, expectedData){
    it('try to modify a test descriptor', async function () {
        await agent.post('/api/testDescriptor').send(data);
        let putAct = await agent.put('/api/testDescriptor/'+id).send(newData);
        putAct.status.should.equal(expectedHTTPStatus);
        if(expectedHTTPStatus === 200){
            let modifiedTestD = await agent.get('/api/testDescriptors/'+id);
            modifiedTestD.body.id.should.equal(expectedData.id);
            modifiedTestD.body.name.should.equal(expectedData.name);
            modifiedTestD.body.procedureDescription.should.equal(expectedData.procedureDescription);
            modifiedTestD.body.idSKU.should.equal(expectedData.idSKU);
        }
    });
}

function deleteTestDescriptor(id, data, expectedHTTPStatus, expectedBodyLen) {
    it('try deleting a test descriptor', async function () {
        let s = await agent.post('/api/testDescriptor').send(data);
        let res = await agent.get('/api/testDescriptors');
        res.body.length.should.equal(1);
        let deleteAct = await agent.delete('/api/testDescriptor/'+id);
        deleteAct.status.should.equal(expectedHTTPStatus);
        let res_postD = await agent.get('/api/testDescriptors');
        res_postD.body.length.should.equal(expectedBodyLen);
    });
}

function getTestDescr(id, data, expectedHTTPStatus, expectedData) {
    it('get a test descriptor', async function () {
        await agent.post('/api/testDescriptor').send(data);
        let res = await agent.get('/api/testDescriptors/'+ id);
        res.status.should.equal(expectedHTTPStatus);
        if (expectedHTTPStatus === 200){
            res.body.id.should.equal(expectedData.id);
            res.body.name.should.equal(expectedData.name);
            res.body.procedureDescription.should.equal(expectedData.procedureDescription);
            res.body.idSKU.should.equal(expectedData.idSKU);
        }
    });
}