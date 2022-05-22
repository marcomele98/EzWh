const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('testDescriptor apis', () => {
    // Delete content table
    beforeEach(async () => {
        await agent.delete('/api/testDescriptor');
        await agent.delete('/api/skus');
    })

    // Try to insert a test descriptor not associated to any skuid
    newTestDescriotor(404, {
        "name":"test descriptor 3",
        "procedureDescription":"This test is described by...",
        "idSKU" :1
    })

    // Check if table is stille empty
    checkTests(200, 0);

    // Insert a SKU in DB
    agent.post('/api/sku').send({
        "description" : "a new sku",
        "weight" : 100,
        "volume" : 50,
        "notes" : "first SKU",
        "price" : 10.99,
        "availableQuantity" : 50
    });
    // now sku exists, it should be possible to insert a test descr.
    newTestDescriotor(422, {
        "name":"test descriptor 3",
        "procedureDescription":"This test is described by...",
        "idSKU" :"as"
    })
    newTestDescriotor(201, {
        "name":"test descriptor 3",
        "procedureDescription":"This test is described by...",
        "idSKU" :1
    });
    checkTests(200, 1);

    // try to change the test descriptor -- will fail : no string id
    modifyTestDescriotor(422, {
        "name":"test descriptor 1",
        "procedureDescription":"This test is described by...",
        "idSKU" :1
    }, "thisisastring");
    // try to change the test descriptor -- will fail : no associated id-sku
    modifyTestDescriotor(404, {
        "name":"test descriptor 1",
        "procedureDescription":"This test is described by...",
        "idSKU" :1343
    }, 0);
    modifyTestDescriotor(200, {
        "name":"test descriptor 1",
        "procedureDescription":"This test is described by...",
        "idSKU" :1
    }, 0);
    // see if changes are effective
    getTestDescriptor(200, {
        "id":1,
        "name":"test descriptor 1",
        "procedureDescription": "This test is described by...",
        "idSKU" :1
    });

    // will fail, no valid id
    deleteTestDescriptor(422, "thisisastring");
    // will succeed
    deleteTestDescriptor(204, 1);
    // check if table is empty
    checkTests(200, 0);
});


function newTestDescriotor(expectedHTTPStatus, data) {
    it('adding a new test descriptor', function (done) {
        agent.post('/api/testDescriptor')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
            done();
    });
}

function checkTests(expectedHTTPStatus, bodyLength){
    it('checking if db has n tuples', function (done) {
        agent.get('/api/testDescriptors')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.length.should.equal(bodyLength);
            });
            done();
    });
}

function modifyTestDescriotor(expectedHTTPStatus, data, id) {
    it('modify a test descriptor', function (done) {
        agent.put('/api/testDescriptor/'+ id)
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
            done();
    });
}

function getTestDescriptor(expectedHTTPStatus, data, id) {
    it('getting test-descr data from the system', function (done) {
        agent.get('/api/testDescriptors/'+ id)
                .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.should.equal(data);
            });
        done();
    });
}

function deleteTestDescriptor(expectedHTTPStatus, id){
    it('delete test-descr data from the system', function (done) {
        agent.delete('/api/testDescriptor/'+ id)
                .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
        });
        done();
    });
}
