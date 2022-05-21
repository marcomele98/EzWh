const ioDAO = require('../modules/database/internalOrderDAO');

describe('testIoDao', () => {
    beforeEach(async () => {
        await ioDAO.deleteTableContent();
    });

    const data = {
        "issueDate": "2021/11/29 09:33",
        "products": [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 3 },
                    { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 3 }],
        "customerId": 1
    }

    test('empty db', async () => {
        var res = await ioDAO.getListInternalOrders();
        expect(res.length).toStrictEqual(0);
    });

    testNewIO(data);
    testDeleteIO(data);
    testModifyIOacc(data);
    testModifyIOcom(data);
    testGetIOissued(data);
    testGetIOaccepted(data);
});

function testNewIO(data) {
    test('create new Internal Order', async () => {

        await ioDAO.storeInternalOrder(data);
        const IO = await ioDAO.getLastId();
        await ioDAO.storeProducts(data.products, IO["MAX(id)"]);

        var prod = await ioDAO.getListProducts(IO["MAX(id)"]);

        var res = await ioDAO.getListInternalOrders();
        expect(res.length).toStrictEqual(1);

        res = await ioDAO.getInternalOrderById(IO["MAX(id)"]);

        expect(res.id).toStrictEqual(IO["MAX(id)"]);
        expect(res.issueDate).toStrictEqual(data.issueDate);
        expect(res.state).toStrictEqual('ISSUED');
        expect(prod).toEqual(data.products);
        expect(res.customerId).toStrictEqual(data.customerId);
    });
}

function testDeleteIO(data) {
    test('delete internal order', async () => {
        
        await ioDAO.storeInternalOrder(data);
        const IO = await ioDAO.getLastId();

        ioDAO.deleteInternalOrderById(IO["MAX(id)"]);

        var res = await ioDAO.getListInternalOrders();
        expect(res.length).toStrictEqual(0);
    });
}


function testModifyIOacc(data) {
    test('modify internal order accepted', async () => {

        newData = {
            newState : 'ACCEPTED'
        }
        await ioDAO.storeInternalOrder(data);
        const IO = await ioDAO.getLastId();

        await ioDAO.modifyStateInternalOrderById(newData, IO["MAX(id)"]);

        var res = await ioDAO.getInternalOrderById(IO["MAX(id)"]);
        expect(res.state).toStrictEqual(newData.newState);
    });
}

function testModifyIOcom(data) {
    test('modify internal order accepted', async () => {

        newData = {
            "newState" : 'COMPLETED',
            "products":[{"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"}]
        }

        expected = {
            "products":[{"SKUId":1,"RFID":"12345678901234567890123456789016"},{"SKUId":1,"RFID":"12345678901234567890123456789038"}]
        }
        await ioDAO.storeInternalOrder(data);
        const IO = await ioDAO.getLastId();
        await ioDAO.storeProducts(data.products, IO["MAX(id)"]);

        await ioDAO.storeSkuIO(newData.products,  IO["MAX(id)"]);
        await ioDAO.modifyStateInternalOrderById(newData, IO["MAX(id)"]);

        var res = await ioDAO.getInternalOrderById(IO["MAX(id)"]);

        var prod = await ioDAO.getListSKU(IO["MAX(id)"]);

        expect(res.id).toStrictEqual(IO["MAX(id)"]);
        expect(res.state).toStrictEqual(newData.newState);
        expect(prod).toEqual(expected.products);
    });
}


function testGetIOissued(data) {
    test('get internal order issued', async () => {
        await ioDAO.storeInternalOrder(data);
        await ioDAO.storeInternalOrder(data);

        var res = await ioDAO.getListIssuedInternalOrders();

        expect(res.length).toStrictEqual(2);
    });
}

function testGetIOaccepted(data) {
    test('get internal order accepted', async () => {

        newData = {
            newState : 'ACCEPTED'
        }

        await ioDAO.storeInternalOrder(data);
        const IO = await ioDAO.getLastId();
        await ioDAO.modifyStateInternalOrderById(newData, IO["MAX(id)"]);

        await ioDAO.storeInternalOrder(data);

        var res = await ioDAO.getListAcceptedInternalOrders();

        expect(res.length).toStrictEqual(1);
    });
}


