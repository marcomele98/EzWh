const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

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

    // beforeEach(async () => {
    //     await agent.delete('/api/position');
    // })
    // // Check db is empty
    // checkPositions(200, 0);
    // // Add a new position. Since data is correct, it should be done without err
    // newPosition(201, pos1);
    // // Retreive the position. It should be able to get the position inserted before
    // getPositions(200, pos1);
    // // Delete the position -- try with a wrong id first
    // deletePosition(422, '80023454341');
    // // Try to modify an existing position -- try to modify a position that does not exist yet
    // modifyPosition(404, '600235543419', {});
    // // Try to modify an existing position -- try to insert wrong data
    // modifyPosition(422, '800234543412', {
    //     "newAisleID": "8012",
    //     "newRow": "3154",
    //     "newCol": "3412",
    //     "newMaxWeight": 1000,
    //     "newMaxVolume": 1000,
    //     "newOccupiedWeight": 300,
    //     "newOccupiedVolume":-1
    // });
    // // Modify a position -- modify aisleID, check whether position ID updates correctly
    // modifyPosition(422, '800234543412', {
    //     "newAisleID": "5555",
    //     "newRow": "3454",
    //     "newCol": "3412",
    //     "newMaxWeight": 1000,
    //     "newMaxVolume": 1000,
    //     "newOccupiedWeight": 300,
    //     "newOccupiedVolume": 3
    // });
    // // Take the position to check whether the change has been done correctly
    // getPositions(200, {
    //     "positionID": "555534543412"
    // });
    // // Try to insert a new position with wrong data
    // newPosition(422, pos2);
    // // Try to insert a new position with correct data
    // newPosition(201, {
    //     "positionID":"112234543412",
    //     "aisleID": "1122",
    //     "row": "3454",
    //     "col": "3412",
    //     "maxWeight": 3000,
    //     "maxVolume": 1000,
    //     "occupiedWeight": 300,
    //     "occupiedVolume":150
    // })
    // // Control if insertion has been successful
    // checkPositions(200, 2)
    // // Delete the position -- use correct id
    // deletePosition(204, '555534543412');
    // // Control if deletion has been successful
    // checkPositions(200, 1);
    // // Try to change ID of position
    // changePositionID(404, '555534543412', '555534543412');
    // changePositionID(422, '112234543412' ,'555534543412sdsdsds');
    // changePositionID(200, '112234543412', '555534543412');
    // // Verify if also aisle, row, col have changed
    // checkFields(200, {
    //     "aisleID": "5555",
    //     "row": "3454",
    //     "col": "3412"
    // })
});

function newPosition(expectedHTTPStatus, data) {
    it('adding a new position', function (done) {
        agent.post('/api/position')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
            });
            done();
    });
}


function getPositions(expectedHTTPStatus, data) {
    it('getting position data from the system', function (done) {
        agent.get('/api/positions')
                .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body[0]['positionId'].should.equal(data['positionId']);
                done();
            });
    });
}

function checkFields(expectedHTTPStatus, fields){
    it('verify position attrs', function(done){
        agent.get('/api/positions')
        .then(function (res){
            res.should.have.status(expectedHTTPStatus);
            res.body['0']['aisleID'].should.equal(fields['aisleID']);
            res.body['0']['row'].should.equal(fields['row']);
            res.body['0']['col'].should.equal(fields['col']);
            done();
        })
    });
}

function checkPositions(expectedHTTPStatus, bodyLength) {
    it('checking if db has n tuples', function (done) {
        agent.get('/api/positions')
                .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.length.should.equal(bodyLength);
                done();
            });
    });
}

function deletePosition(expectedHTTPStatus, id){
    it('deleting position data', function (done) {
        agent.delete('/api/position/' + id)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        })
    });
}

function modifyPosition(expectedHTTPStatus, id, newData){
    it('updating position data', function (done){
        agent.put('/api/position/' + id)
        .send(newData)
        .then(function (res){
            res.should.have.status(expectedHTTPStatus);
            done();
        })
    });
}

function changePositionID(expectedHTTPStatus, id, newID){
    it('updating position id', function (done){
        agent.put('/api/position/' + id+ '/changeID')
        .send(newID)
        .then(function (res){
            res.should.have.status(expectedHTTPStatus);
            done();
        })
    });
}