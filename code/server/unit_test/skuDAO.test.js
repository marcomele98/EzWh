
const skuDAO = require('../modules/database/skuDAO');

describe('testSkuDAO', () => {
    beforeEach(async () => {
        await skuDAO.deleteTableContent();
    });

    const data = {
        "id": "1",
        "description": "second sku of the list",
        "weight": 50,
        "volume": 20,
        "notes": "Get by the supplier 2",
        "availableQuantity": 20,
        "price": 20.30,
    }

    test('empty dao', async () => {
        var res = await skuDAO.getSkuList();
        expect(res.length).toStrictEqual(0);
    });

    testNewSku(data);
    testUpdateSku(data);
    testSetPosition(data);
    testUpdateQuantity(data);
    testDeleteSku(data.id);
});


function testNewSku(data) {
    test('create new sku', async () => {
        await skuDAO.addSku(data);
        var result = await skuDAO.getSkuList();
        expect(result.length).toStrictEqual(1);
       
        result = await skuDAO.getSkuById(data.id);
        expect(result.description).toStrictEqual(data.description);
        expect(result.weight).toStrictEqual(data.weight);
        expect(result.volume).toStrictEqual(data.volume);
        expect(result.notes).toStrictEqual(data.notes);
        expect(result.availableQuantity).toStrictEqual(data.availableQuantity);
        expect(result.price).toStrictEqual(data.price);
    });

    test('create new sku - duplicate', async () => {
        await skuDAO.addSku(data);
        try {
            await skuDAO.addSku(data);
        } catch (e) {
            expect(e).toEqual('SQLITE_CONSTRAINT: UNIQUE constraint failed: sku.id');
        }
    });
}

function testDeleteSku(id){ 
    test('delete sku', async () => {
        await skuDAO.deleteSkuById(id);
        let check = await skuDAO.getSkuList();
        expect(check.length).toStrictEqual(0);
    })
}

function testUpdateSku(data){
    test('update sku', async () => {
        const newData = {
            "newDescription" : "test for updating",
            "newWeight": 10,
            "newVolume": 10,
            "newNotes" : "test new values",
            "newAvailableQuantity" : 10,
            "newPrice" : 2.00,
        }
        await skuDAO.addSku(data)
        await skuDAO.updateSkuInfo(data.id, newData);
        let check = await skuDAO.getSkuById(data.id); 
        expect(check.description).toStrictEqual(newData.newDescription);
        expect(check.weight).toStrictEqual(newData.newWeight);
        expect(check.volume).toStrictEqual(newData.newVolume);
        expect(check.notes).toStrictEqual(newData.newNotes);
        expect(check.availableQuantity).toStrictEqual(newData.newAvailableQuantity);
        expect(check.price).toStrictEqual(newData.newPrice);
    })
}


function testSetPosition(data){
    test('set position test', async () => {
        const position = "800234523412";
        await skuDAO.addSku(data);
        await skuDAO.setPosition(data.id, position);
        let res = await skuDAO.getSkuById(data.id);
        expect(res.description).toStrictEqual(data.description);
        expect(res.weight).toStrictEqual(data.weight);
        expect(res.volume).toStrictEqual(data.volume);
        expect(res.notes).toStrictEqual(data.notes);
        expect(res.availableQuantity).toStrictEqual(data.availableQuantity);
        expect(res.price).toStrictEqual(data.price);
        expect(res.position).toStrictEqual("800234523412");
    })
}

function testUpdateQuantity(data){
    test('update quantity test', async () => {
        const quantity = 10;
        await skuDAO.addSku(data);
        await skuDAO.updateQuantity(data.id, quantity);
        let res = await skuDAO.getSkuById(data.id);
        expect(res.description).toStrictEqual(data.description);
        expect(res.weight).toStrictEqual(data.weight);
        expect(res.volume).toStrictEqual(data.volume);
        expect(res.notes).toStrictEqual(data.notes);
        expect(res.availableQuantity).toStrictEqual(10);
        expect(res.price).toStrictEqual(data.price);
    })
}

