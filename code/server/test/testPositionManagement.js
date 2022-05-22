const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);
const positionDAO = require('../modules/database/positionDAO');
const { expect } = require('chai');

describe('position apis', () => {

    // correct data
    let pos1 = {
        "positionID":"800234543412",
        "aisleID": "8002",
        "row": "3454",
        "col": "3412",
        "maxWeight": 1000,
        "maxVolume": 1000,
        "occupiedWeight": 300,
        "occupiedVolume":150
    };

    // wrong data
    let pos2 =  {
        "positionID":"801234543412",
        "aisleID": "8012",
        "row": "3154",
        "col": "3412",
        "maxWeight": 1000,
        "maxVolume": 1000,
        "occupiedWeight": 300,
        "occupiedVolume":150
    };

    beforeEach(async () => {
        await positionDAO.deleteTableContent();
    })

    // insert correct data
    newPosition(pos1);
    // try to insert incorrect data
    newPosition_incorrectData(pos2);
    // try to modify a position that does not exists
    modifyPosition_wrongData(800234543419, {
        "newAisleID": "8002",
        "newRow": "3454",
        "newCol": "3412",
        "newMaxWeight": 1200,
        "newMaxVolume": 600,
        "newOccupiedWeight": 200,
        "newOccupiedVolume":100
    }, 404);
    // try to modify a position with wrong data
    modifyPosition_wrongData(800234543412, {
        "newAisleID": "8002",
        "newRow": "3454",
        "newCol": "3412",
        "newMaxWeight": 1200,
        "newMaxVolume": 600,
        "newOccupiedWeight": 200,
        "newOccupiedVolume":-1
    }, 422);
    // modify a position
    modifyPosition(pos1, {
        "newAisleID": "1002",
        "newRow": "3454",
        "newCol": "3412",
        "newMaxWeight": 1200,
        "newMaxVolume": 600,
        "newOccupiedWeight": 200,
        "newOccupiedVolume":100
    }, '100234543412');
    changeId(pos1, {
        "newPositionID": "873234543412"
    }, '8732', '3454', '3412');
    // try to delete a position
    deletePosition(pos1, '1004543412', 422, 1);
    deletePosition(pos1, '800234543412', 204, 0);
});

function newPosition(data) {
    it('adding a new position', async function () {
        let s = await agent.post('/api/position').send(data);
        s.status.should.equal(201);
        let res = await agent.get('/api/positions');
        res.status.should.equal(200);
        res.body[0].positionID.should.equal(data.positionID);
        res.body[0].occupiedVolume.should.equal(0);
        res.body[0].occupiedWeight.should.equal(0);
    });
}


function newPosition_incorrectData(data) {
    it('adding a new position with wrong data', async function () {
        let s = await agent.post('/api/position').send(data);
        s.status.should.equal(422);
        let res = await agent.get('/api/positions');
        res.status.should.equal(200);
        res.body.length.should.equal(0);
    });
}

function modifyPosition_wrongData(positionID, newData, expectedHTTPStatus) {
    it('try to modify a position', async function () {
        let s = await agent.put('/api/position/'+positionID).send(newData);
        s.status.should.equal(expectedHTTPStatus);
    });
}

function modifyPosition(data, newData, newId) {
    it('try to modify a position', async function () {
        await agent.post('/api/position').send(data);
        let s = await agent.put('/api/position/'+data.positionID).send(newData);
        s.status.should.equal(200);
        let res = await agent.get('/api/positions');
        res.status.should.equal(200);
        res.body[0].positionID.should.equal(newId);
    });
}

function changeId(data, newData, newAisle, newRow, newCol) {
    it('try to modify a position id', async function () {
        await agent.post('/api/position').send(data);
        let s = await agent.put('/api/position/'+data.positionID+'/changeID').send(newData);
        s.status.should.equal(200);
        let res = await agent.get('/api/positions');
        res.body[0].aisleID.should.equal(newAisle);
        res.body[0].row.should.equal(newRow);
        res.body[0].col.should.equal(newCol);
    });
}

function deletePosition(data, id, expectedHTTPStatus, expectedBodyLen) {
    it('try to delete a position', async function () {
        await agent.post('/api/position').send(data);
        let res = await agent.get('/api/positions');
        res.body.length.should.equal(1);
        let s = await agent.delete('/api/position/'+id);
        s.status.should.equal(expectedHTTPStatus);
        let res_postd = await agent.get('/api/positions');
        res_postd.body.length.should.equal(expectedBodyLen);
    });
}
