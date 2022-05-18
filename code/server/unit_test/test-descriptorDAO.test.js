const testDescriptorDAO = require('../modules/database/test-descriptorDAO');

describe('testDao', () => {
    beforeEach(async () => {
        await testDescriptorDAO.deleteTableContent();
    });

    const data =  {    
        "name":"test descriptor 1",
        "procedureDescription": "This test is described by...",
        "idSKU" :1
    }

    test('empty db', async () => {
        var res = await testDescriptorDAO.getListTestDescriptors();
        expect(res.length).toStrictEqual(0);
    });

    testNewDescriptor(data);
    testModifyDescriptor(data);
});

function testNewDescriptor(data) {
    test('create new test descriptor', async () => {
        await testDescriptorDAO.createTestDescriptor(1, data);
        
        var res = await testDescriptorDAO.getListTestDescriptors();
        expect(res.length).toStrictEqual(1);
        
        res = await testDescriptorDAO.getTestDescriptorByID(1);

        expect(res.name).toStrictEqual(data.name);
        expect(res.procedureDescription).toStrictEqual(data.procedureDescription);
        expect(res.idSKU).toStrictEqual(data.idSKU);

        try{
            await testDescriptorDAO.createTestDescriptor(1, data);
        }catch(e){
            expect(e).toEqual('SQLITE_CONSTRAINT: UNIQUE constraint failed: TESTDESCRIPTORS.id');
        }

        await testDescriptorDAO.deleteTestDescriptorByID(1);
        let startingID = await testDescriptorDAO.getLastID();
        await testDescriptorDAO.createTestDescriptor(1, data);
        let lastID = await testDescriptorDAO.getLastID();

        expect(startingID['last']).toStrictEqual(null);
        expect(lastID['last']).toStrictEqual(1);
    });
}

function testModifyDescriptor(data){
    test('Modify a test descriptor', async () => {
        newData= {
            "newName":"test descriptor 2",
            "newProcedureDescription":"This test is described by...",
            "newIdSKU" :2
        }
        await testDescriptorDAO.createTestDescriptor(1, data);
        await testDescriptorDAO.modifyTestDescriptorByID(1, newData);
        res = await testDescriptorDAO.getTestListBySKU(2);

        expect(res.name).toStrictEqual(newData.name);
        expect(res.procedureDescription).toStrictEqual(newData.procedureDescription);
        expect(res.idSKU).toStrictEqual(newData.idSKU);
    });
}