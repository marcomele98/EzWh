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
    testModifyPosition(data);
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

        try{
            await positionDAO.createNewPositionWH(data);
        }catch(e){
            expect(e).toEqual('SQLITE_CONSTRAINT: UNIQUE constraint failed: POSITIONS.positionID');
        }

        await positionDAO.deletePositionWHByID(data.positionID);
        await positionDAO.createNewPositionWH(data);
    });
}

function testModifyPosition(data) {
    test('modify position id', async () => {
        await positionDAO.createNewPositionWH(data);
        const oldId = data.positionID;
        const newId = '800234543412';
        const aisle = newId.slice(0, 4);
        const row = newId.slice(4, 8);
        const col = newId.slice(8, 12);
        await positionDAO.modifyPositionID(oldId, newId, aisle, row, col);
        var modifiedPos = await positionDAO.getPositionByID(newId);
        var oldPos = await positionDAO.getPositionByID(oldId);
        expect(modifiedPos).toEqual({
            "positionID":"800234543412",
            "aisleID": "8002",
            "row": "3454",
            "col": "3412",
            "maxWeight": 1000,
            "maxVolume": 1000,
            "occupiedWeight": 0,
            "occupiedVolume": 0
        })
        expect(oldPos).toEqual(undefined);

        newData = {
            "newAisleID": "8002",
            "newRow": "3454",
            "newCol": "3412",
            "newMaxWeight": 1000,
            "newMaxVolume": 1010,
            "newOccupiedWeight": 100,
            "newOccupiedVolume": 100
        };
        await positionDAO.modifyPositionAttributes(newData, newId, newId);
        modifiedPos = await positionDAO.getPositionByID(newId);
        expect(modifiedPos).toEqual({
            "positionID":"800234543412",
            "aisleID": "8002",
            "row": "3454",
            "col": "3412",
            "maxWeight": 1000,
            "maxVolume": 1010,
            "occupiedWeight": 100,
            "occupiedVolume": 100
        })

        await positionDAO.updateInfoBySKU(newId, 200, 200);
        modifiedPos = await positionDAO.getPositionByID(newId);
        expect(modifiedPos).toEqual({
            "positionID":"800234543412",
            "aisleID": "8002",
            "row": "3454",
            "col": "3412",
            "maxWeight": 1000,
            "maxVolume": 1010,
            "occupiedWeight": 200,
            "occupiedVolume": 200
        })

    });
}