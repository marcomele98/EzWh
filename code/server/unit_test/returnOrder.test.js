const returnOrderDAO = require('../modules/database/returnOrderDAO');

describe('testDao', () => {
    beforeEach(async () => {
        await returnOrderDAO.deleteTableContent();
    });

    const data =  {
        "returnDate":"2021/11/29 09:33",
        "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                    {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
        "restockOrderId" : 1
    };

    test('empty db', async () => {
        var res = await returnOrderDAO.getListReturnOrders();
        expect(res.length).toStrictEqual(0);
    });

    testNewReturnOrder(data);
});

function testNewReturnOrder(data) {
    test('create new return order', async () => {
        await returnOrderDAO.storeReturnOrder(data);
        const RET = await returnOrderDAO.getLastId();
        returnOrderDAO.storeProductRET(data.products, RET["MAX(id)"]);
        
        var res = await returnOrderDAO.getListReturnOrders();
        expect(res.length).toStrictEqual(1);
        
        res = await returnOrderDAO.getReturnOrderById(data.id);
        resprod = await returnOrderDAO.getListProductRET(data.id);

        expect(res.returnDate).toStrictEqual(data.returnDate);
        expect(res.restockOrderId).toStrictEqual(data.restockOrderId);
        expect(resprod.products).toStrictEqual(data.products);

        try{
            await returnOrderDAO.storeRestockOrder(data);
        }catch(e){
            expect(e).toEqual('SQLITE_CONSTRAINT: UNIQUE constraint failed: returnOrders.id');
        }

        await returnOrderDAO.deleteRestockOrderById(data.id);
        await returnOrderDAO.storeRestockOrder(data);
    });
}
