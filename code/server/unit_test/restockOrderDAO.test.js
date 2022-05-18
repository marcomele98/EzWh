const restockOrderDAO = require('../modules/database/restockOrderDAO');

describe('testDao', () => {
    beforeEach(async () => {
        await restockOrderDAO.deleteTableContent();
    });

    const data =  {
        "issueDate":"2021/11/29 09:33",
        "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
                    {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
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
        restockOrderDAO.storeProducts(data.products, RE["MAX(id)"]);
        
        var res = await restockOrderDAO.getListRestockOrders();
        expect(res.length).toStrictEqual(1);
        
        res = await restockOrderDAO.getRestockOrderById(data.id);
        resprod = await restockOrderDAO.getListProducts(data.id);

        expect(res.issueDate).toStrictEqual(data.issueDate);
        expect(resprod.products).toStrictEqual(data.products);
        expect(res.supplierId).toStrictEqual(data.supplierId);
        expect(res.SKUItems.length).toStrictEqual(0);
        expect(res.transportNote.length).toStrictEqual(0);

        try{
            await restockOrderDAO.storeRestockOrder(data);
        }catch(e){
            expect(e).toEqual('SQLITE_CONSTRAINT: UNIQUE constraint failed: restockOrders.id');
        }

        await restockOrderDAO.deleteRestockOrderById(data.id);
        await restockOrderDAO.storeRestockOrder(data);
    });
}

function testModifyRestockOrder(data) {
    test('modify restock order', async () => {
        await restockOrderDAO.storeRestockOrder(data);
        const newState = {
            "newState":"DELIVERED"
        }
;
        await restockOrderDAO.modifyStateRestockOrderById(data.id, newState);
        var modifiedRestockOrder = await restockOrderDAO.getRestockOrderById(data.id);
        expect(modifiedRestockOrder).toEqual({
            "id":1,
            "issueDate":"2021/11/29 09:33",
            "state": "DELIVERY",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
                    {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 1
        });

        const newskuItems = {
            "skuItems" : [{"SKUId":12,"rfid":"12345678901234567890123456789016"},
            {"SKUId":12,"rfid":"12345678901234567890123456789017"}]
        };

        await restockOrderDAO.storeSkuRE(newskuItems,data.id);
        modifiedRestockOrder = await restockOrderDAO.getRestockOrderById(data.id);
        expect(modifiedRestockOrder).toEqual({
            "id":1,
            "issueDate":"2021/11/29 09:33",
            "state": "DELIVERY",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
                    {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 1,
            "skuItems" : [{"SKUId":12,"rfid":"12345678901234567890123456789016"},{"SKUId":12,"rfid":"12345678901234567890123456789017"}]
        });

        const newTransportNote = {
            "transportNote":{"deliveryDate":"2021/12/29"}
        };

        await restockOrderDAO.storeTransportNote(newTransportNote,data.id);
        modifiedRestockOrder = await restockOrderDAO.getRestockOrderById(data.id);
        expect(modifiedRestockOrder).toEqual({
            "id":1,
            "issueDate":"2021/11/29 09:33",
            "state": "DELIVERY",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
                    {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
            "supplierId" : 1,
            "transportNote":{"deliveryDate":"2021/12/29"},
            "skuItems" : [{"SKUId":12,"rfid":"12345678901234567890123456789016"},{"SKUId":12,"rfid":"12345678901234567890123456789017"}]
        });

    });
}