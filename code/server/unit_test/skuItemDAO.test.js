const skuItemDAO = require('../modules/database/skuItemDAO');

describe('testSkuDAO', () => {
    beforeEach(async () => {
        await skuItemDAO.deleteTableContent();
    });

    const data = {
        "RFID": "12345612345612345612345612345612",
        "SKUId": 1,
        "DateOfStock": "28/11/2021",
    }

    test('empty dao', async () => {
        var res = await skuItemDAO.getSkuItemList();
        expect(res.length).toStrictEqual(0);
    });

    testNewSkuItem(data);
    testUpdateSkuItem(data);
    testSetAvailalbe(data);
    testGetSkuItemsBySkuId(data);
    testDeleteSkuItem(data.RFID);

});


function testNewSkuItem(data) {
    test('create new skuItem', async () => {
        await skuItemDAO.storeSkuItem(data);
        var result = await skuItemDAO.getSkuItemList();
        expect(result.length).toStrictEqual(1);

        result = await skuItemDAO.getSkuItemByRfid(data.RFID);
        expect(result.SKUId).toStrictEqual(data.SKUId);
        expect(result.Available).toStrictEqual(0);
        expect(result.DateOfStock).toStrictEqual(data.DateOfStock);
    });

    test('create new sku - duplicate', async () => {
        await skuItemDAO.storeSkuItem(data);
        try {
            await skuItemDAO.storeSkuItem(data);
        } catch (e) {
            expect(e).toEqual('SQLITE_CONSTRAINT: UNIQUE constraint failed: skuItem.RFID');
        }
    });
}

function testDeleteSkuItem(rfid) {
    test('delete skuItem', async () => {
        await skuItemDAO.deleteSkuItemByRfid(rfid);
        let check = await skuItemDAO.getSkuItemList();
        expect(check.length).toStrictEqual(0);
    })
}

function testUpdateSkuItem(data) {
    test('update skuItem info', async () => {
        const newData = {
            "newRFID": "12345612345612345612345612345612",
            "newAvailable": 1,
            "newDateOfStock": "25/11/2022",
        }
        await skuItemDAO.storeSkuItem(data)
        await skuItemDAO.editInfoSkuItem(data.RFID, newData);
        let check = await skuItemDAO.getSkuItemByRfid(newData.newRFID);
        expect(check.RFID).toStrictEqual(newData.newRFID);
        expect(check.Available).toStrictEqual(1);
        expect(check.DateOfStock).toStrictEqual(newData.newDateOfStock);
    })
}


function testSetAvailalbe(data) {
    test('set available test', async () => {
        const available = 1;
        await skuItemDAO.storeSkuItem(data);
        await skuItemDAO.setAvailable(data.RFID, available);
        let res = await skuItemDAO.getSkuItemByRfid(data.RFID);
        expect(res.RFID).toStrictEqual(data.RFID);
        expect(res.SKUId).toStrictEqual(data.SKUId);
        expect(res.Available).toStrictEqual(1);
        expect(res.DateOfStock).toStrictEqual(data.DateOfStock);
    })
}

function testGetSkuItemsBySkuId(data){
    test('test get skuItems by SKUId', async() => {
        await skuItemDAO.storeSkuItem(data);
        await skuItemDAO.setAvailable(data.RFID, 1);
        let resBySku = await skuItemDAO.getSkuItemBySkuId(data.SKUId);
        for (let i = 0; i < resBySku.length; i++) {
            expect(resBySku[i].SKUId).toStrictEqual(data.SKUId);
        }
        for (let j = 0; j < resBySku.length; j++) {
            let check = await skuItemDAO.getSkuItemByRfid(resBySku[j].RFID);
            expect(check.Available).toStrictEqual(1);
        }
    })
}