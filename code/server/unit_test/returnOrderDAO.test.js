const returnOrderDAO = require('../modules/database/returnOrderDAO');
const restockOrderDAO = require('../modules/database/restockOrderDAO');

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

    restockOrderinput = {
        "issueDate":"2021/11/29 09:33",
        "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":30},
                    {"SKUId":180,"description":"another product","price":11.99,"qty":20}],
        "supplierId" : 1
    };

    test('empty db', async () => {
        var res = await returnOrderDAO.getListReturnOrders();
        expect(res.length).toStrictEqual(0);
    });

    testNewReturnOrder(data,restockOrderinput);
});

function testNewReturnOrder(data,restockOrderinput) {
    test('create new return order', async () => {

        await restockOrderDAO.storeRestockOrder(restockOrderinput);

        await returnOrderDAO.storeReturnOrder(data);
        const RET = await returnOrderDAO.getLastId();
        await returnOrderDAO.storeProductRET(data.products, RET["MAX(id)"]);
        
        var res = await returnOrderDAO.getListReturnOrders();
        expect(res.length).toStrictEqual(1);

        var retorder = await returnOrderDAO.getReturnOrderById(RET["MAX(id)"]);
        var resprod = await returnOrderDAO.getListProductRET(RET["MAX(id)"]);

        expect(retorder.returnDate).toStrictEqual(data.returnDate);
        expect(retorder.restockOrderId).toStrictEqual(data.restockOrderId);
        expect(resprod).toEqual(data.products);

        try{
            await returnOrderDAO.storeReturnOrder(data);
        }catch(e){
            expect(e).toEqual('SQLITE_CONSTRAINT: UNIQUE constraint failed: returnOrders.id');
        }

        await returnOrderDAO.deleteReturnOrderById(RET["MAX(id)"]);
        await returnOrderDAO.storeReturnOrder(data);
    });
}
