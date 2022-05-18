const positionDAO = require('../modules/database/positionDAO');

describe('testDao', () => {
    beforeEach(async () => {
        await positionDAO.deleteTableContent();
    });

    const data =  {
        "positionID":"800234543418",
        "aisleID": "8002",
        "row": "3454",
        "col": "3418",
        "maxWeight": 1000,
        "maxVolume": 1000,
    }

    test('empty db', async () => {
        var res = await positionDAO.getListAllPositionsWH();
        expect(res.length).toStrictEqual(0);
    });

    testNewPosition(data);
});

function testNewPosition(data) {
    test('create new position', async () => {
        await positionDAO.createNewPositionWH(data);
        
        var res = await positionDAO.getListAllPositionsWH();
        expect(res.length).toStrictEqual(1);
        
        res = await positionDAO.getPositionByID(data.positionID);

        expect(res.aisleID).toStrictEqual(data.aisleID);
        expect(res.row).toStrictEqual(data.row);
        expect(res.col).toStrictEqual(data.col);
        expect(res.occupiedWeight).toStrictEqual(0);
        expect(res.occupiedVolume).toStrictEqual(0);
    });

    test('create new position - duplicate', async () => {
        await positionDAO.createNewPositionWH(data);
        try{
            await positionDAO.createNewPositionWH(data);
        }catch(e){
            expect(e).toEqual('SQLITE_CONSTRAINT: UNIQUE constraint failed: POSITIONS.positionID');
        }
    });
}