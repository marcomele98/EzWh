const restockOrderDAO = require('../modules/database/restockOrderDAO');

describe('testDao', () => {
    beforeEach(async () => {
        await restockOrderDAO.deleteTableContent();
    });
    
    const data =  {
        "issueDate":"2021/11/29 09:33",
        "products": [{"SKUId":12, "itemId":10, "description":"a product","price":10.99,"qty":30},
                    {"SKUId":180, "itemId":18, "description":"another product","price":11.99,"qty":20}],
        "supplierId" : 1
    }

    test('empty db', async () => {
        var res = await restockOrderDAO.getListRestockOrders();
        expect(res.length).toStrictEqual(0);
    });

    testNewRestockOrder(data);
    testModifyRestockOrder(data);
});

function testNewRestockOrder(data) {
    test('create new restock order', async () => {
        await restockOrderDAO.storeRestockOrder(data);
        const RE = await restockOrderDAO.getLastId();
        await restockOrderDAO.storeProducts(data.products, RE["MAX(id)"]);
        
        var res = await restockOrderDAO.getListRestockOrders();
        expect(res.length).toStrictEqual(1);

        var res = await restockOrderDAO.getListIssuedRestockOrders();
        expect(res.length).toStrictEqual(1);
        
        res = await restockOrderDAO.getRestockOrderById(RE["MAX(id)"]);
        resprod = await restockOrderDAO.getListProducts(RE["MAX(id)"]);

        expect(res.issueDate).toStrictEqual(data.issueDate);
        expect(resprod).toEqual(data.products);
        expect(res.supplierId).toStrictEqual(data.supplierId);
        expect(res.SKUItems).toStrictEqual(undefined);
        expect(res.transportNote).toStrictEqual(null);

        try{
            await restockOrderDAO.storeRestockOrder(data);
        }catch(e){
            expect(e).toEqual('SQLITE_CONSTRAINT: UNIQUE constraint failed: restockOrders.id');
        }

        await restockOrderDAO.deleteRestockOrderById(RE["MAX(id)"]);
        await restockOrderDAO.storeRestockOrder(data);
    });
}

function testModifyRestockOrder(data) {
    test('modify restock order', async () => {
        await restockOrderDAO.storeRestockOrder(data);
        RE = await restockOrderDAO.getLastId();
        await restockOrderDAO.storeProducts(data.products, RE["MAX(id)"]);

        const newState = {
            "newState":"DELIVERED"
        };
        
        await restockOrderDAO.modifyStateRestockOrderById(newState,RE["MAX(id)"]);
        var modifiedRestockOrder = await restockOrderDAO.getRestockOrderById(RE["MAX(id)"]);
        modifiedRestockOrder.products = await restockOrderDAO.getListProducts(RE["MAX(id)"]);
        expect(modifiedRestockOrder).toEqual({
            "id":1,
            "issueDate":"2021/11/29 09:33",
            "state": "DELIVERED",
            "products": [{"SKUId":12, "itemId":10, "description":"a product","price":10.99,"qty":30},
                    {"SKUId":180, "itemId":18, "description":"another product","price":11.99,"qty":20}],
            "supplierId" : 1,
            "transportNote":null,
            "skuItems" : null
        });

        const newskuItems = {
            "skuItems" : [{"SKUId":12, "itemId":10, "rfid":"12345678901234567890123456789016"},
            {"SKUId":12, "itemId":10, "rfid":"12345678901234567890123456789017"}]
        };

        await restockOrderDAO.storeSkuRE(newskuItems, RE["MAX(id)"]);
        var modifiedRestockOrder = await restockOrderDAO.getRestockOrderById(RE["MAX(id)"]);
        modifiedRestockOrder.products = await restockOrderDAO.getListProducts(RE["MAX(id)"]);
        modifiedRestockOrder.skuItems = await restockOrderDAO.getListSKURE(RE["MAX(id)"]);
        expect(modifiedRestockOrder).toEqual({
            "id":1,
            "issueDate":"2021/11/29 09:33",
            "state": "DELIVERED",
            "products": [{"SKUId":12, "itemId":10, "description":"a product","price":10.99,"qty":30},
                    {"SKUId":180, "itemId":18, "description":"another product","price":11.99,"qty":20}],
            "supplierId" : 1,
            "transportNote":null,
            "skuItems" : [{"SKUId":12, "itemId":10, "rfid":"12345678901234567890123456789016"},{"SKUId":12, "itemId":10, "rfid":"12345678901234567890123456789017"}]
        });

        const newTransportNote = {
            "transportNote":{"deliveryDate":"2021/12/29"}
        };

        await restockOrderDAO.storeTransportNote(newTransportNote, RE["MAX(id)"]);
        var modifiedRestockOrder = await restockOrderDAO.getRestockOrderById(RE["MAX(id)"]);
        modifiedRestockOrder.products = await restockOrderDAO.getListProducts(RE["MAX(id)"]);
        modifiedRestockOrder.skuItems = await restockOrderDAO.getListSKURE(RE["MAX(id)"]);
        modifiedRestockOrder.transportNote = await restockOrderDAO.getTransportNote(RE["MAX(id)"]);
        expect(modifiedRestockOrder).toEqual({
            "id":1,
            "issueDate":"2021/11/29 09:33",
            "state": "DELIVERED",
            "products": [{"SKUId":12, "itemId":10, "description":"a product","price":10.99,"qty":30},
                    {"SKUId":180, "itemId":18, "description":"another product","price":11.99,"qty":20}],
            "supplierId" : 1,
            "transportNote":{"deliveryDate":"2021/12/29"},
            "skuItems" : [{"SKUId":12, "itemId":10, "rfid":"12345678901234567890123456789016"},{"SKUId":12, "itemId":10, "rfid":"12345678901234567890123456789017"}]
        });

        await restockOrderDAO.deleteRestockOrderById(RE["MAX(id)"]);

    });
}