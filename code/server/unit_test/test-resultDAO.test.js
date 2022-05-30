const testResultDAO = require('../modules/database/test-resultDAO');

describe('testDao', () => {
    beforeEach(async () => {
        await testResultDAO.deleteTableContent();
    });

    const data1 =  {
        "rfid":"12345678901234567890123456789016",
        "idTestDescriptor":12,
        "Date":"2021/11/28",
        "Result": 0
    }

    const data2 =  {
        "rfid":"12345678901234567890123456789012",
        "idTestDescriptor":12,
        "Date":"2021/11/28",
        "Result": 0
    }


    test('empty db', async () => {
        var res = await testResultDAO.getLastID();
        expect(res['last']).toStrictEqual(null);
    });

    testNewResult(data1, data2);
    testModifyResult(data1, data2);
});

function testNewResult(data1, data2){
    test('create new test result', async () => {
        await testResultDAO.createTestResultByRfid(1, data1);
        try{
            await testResultDAO.createTestResultByRfid(1, data2);
        }catch(e){
            expect(e).toEqual('SQLITE_CONSTRAINT: UNIQUE constraint failed: TESTRESULTS.id');
        }
        await testResultDAO.createTestResultByRfid(2, data2);

        let res1 = await testResultDAO.getTestResultsListByRfid('12345678901234567890123456789016');
        let res2 = await testResultDAO.getTestResultsListByRfid('12345678901234567890123456789012');

        expect(res1.length).toStrictEqual(1);
        expect(res2.length).toStrictEqual(1);

        await testResultDAO.deleteTestResultByIds(2, '12345678901234567890123456789012');
        res2 = await testResultDAO.getTestResultsListByRfid('12345678901234567890123456789012');
        expect(res2.length).toStrictEqual(0);
    });
}

function testModifyResult(data1, data2){
    test('modify a test result', async () => {
        await testResultDAO.createTestResultByRfid(1, data1);
        await testResultDAO.createTestResultByRfid(2, data2);

        const newData = {
            "newIdTestDescriptor":1,
            "newDate":"2021/11/08",
            "newResult": 1
        }

        await testResultDAO.modifyTestResultByIds(1, newData, "12345678901234567890123456789016");
        let mod1 = await testResultDAO.getPassByIds(1, '12345678901234567890123456789016');
        expect(mod1['rfid']).toStrictEqual("12345678901234567890123456789016");
        await testResultDAO.deleteTestResultsByIdTestDescriptor(1);
        let deleted = await testResultDAO.getTestResultByIds(1, '12345678901234567890123456789016');
        expect(deleted).toStrictEqual(undefined);
    });
}