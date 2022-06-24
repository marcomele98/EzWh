const itemDAO = require('../modules/database/itemDAO');

describe('testItemDao', () => {
    beforeEach(async () => {
        await itemDAO.deleteTableContent();
    });

    const data = {
        "id": 1,
        "description": "a new item",
        "price": 10.99,
        "SKUId": 1,
        "supplierId": 2
    }

    test('empty db', async () => {
        var res = await itemDAO.getListItems();
        expect(res.length).toStrictEqual(0);
    });

    testNewItem(data);
    testModifyItem(data);
    testGetSkuBySupplier(data);
    testDeleteItem(data);
});

function testNewItem(data) {
    test('create new item', async () => {
        await itemDAO.storeItem(data);

        var res = await itemDAO.getListItems();
        expect(res.length).toStrictEqual(1);

        res = await itemDAO.getItemById(data.id, data.supplierId);

        expect(res.id).toStrictEqual(data.id);
        expect(res.description).toStrictEqual(data.description);
        expect(res.price).toStrictEqual(data.price);
        expect(res.SKUId).toStrictEqual(data.SKUId);
        expect(res.supplierId).toStrictEqual(data.supplierId);
    });

    test('create new item - duplicate', async () => {
        await itemDAO.storeItem(data);
        try {
            await itemDAO.storeItem(data);
        } catch (e) {
            expect(e).toEqual('SQLITE_CONSTRAINT: UNIQUE constraint failed: items.id, items.supplierId');
        }
    });
}

function testDeleteItem(data) {
    test('delete item', async () => {
        await itemDAO.storeItem(data);
        await itemDAO.deleteItemById(data.id, data.supplierId);
        var res = await itemDAO.getListItems();
        expect(res.length).toStrictEqual(0);
    });
}

function testModifyItem(data) {
    test('modify item', async () => {

        const newData = {
            "newDescription": "a new sku 2",
            "newPrice": 15.99
        }

        await itemDAO.storeItem(data);
        await itemDAO.modifyItemById(data.id, newData, data.supplierId);

        res = await itemDAO.getItemById(data.id, data.supplierId);

        expect(res.id).toStrictEqual(data.id);
        expect(res.description).toStrictEqual(newData.newDescription);
        expect(res.price).toStrictEqual(newData.newPrice);
        expect(res.SKUId).toStrictEqual(data.SKUId);
        expect(res.supplierId).toStrictEqual(data.supplierId);
    });
}

function testGetSkuBySupplier(data) {
    test('get sku by supp', async () => {
        await itemDAO.storeItem(data);
        res = await itemDAO.getSkuBySupplier(data.SKUId, data.supplierId);

        expect(res.id).toStrictEqual(data.id);
        expect(res.description).toStrictEqual(data.description);
        expect(res.price).toStrictEqual(data.price);
        expect(res.SKUId).toStrictEqual(data.SKUId);
        expect(res.supplierId).toStrictEqual(data.supplierId);
    });
}