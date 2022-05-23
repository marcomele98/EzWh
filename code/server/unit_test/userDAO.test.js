const userDAO = require('../modules/database/userDAO');

describe('testUserDao', () => {

    beforeEach(async () => {
        await userDAO.deleteTableContent();
    });

    const data =     {
        "username":"user2@ezwh.com",
        "name":"John",
        "surname" : "Smith",
        "password" : "testpassword",
        "type" : "customer"
    }

    test('correct db', async () => {
        var res = await userDAO.getListUsers();
        expect(res.length).toStrictEqual(5);
    });

    testNewUser(data);
    testGetUserByUserAndPass(data);
    testGetSuppliers();
    testModifyUser(data);
    testDeleteUser(data);

});

function testNewUser(data) {
    test('create new user', async () => {
        await userDAO.createNewUser(data);
        var res = await userDAO.getListUsers();
        expect(res.length).toStrictEqual(6);

        res = await userDAO.getUserByUsernameAndType(data.username, data.type);

        expect(res.email).toStrictEqual(data.username);
        expect(res.name).toStrictEqual(data.name);
        expect(res.surname).toStrictEqual(data.surname);
        expect(res.password).toStrictEqual(data.password);
        expect(res.type).toStrictEqual(data.type);
    });
}

function testDeleteUser(data) {
    test('delete user', async () => {
        await userDAO.createNewUser(data);
        await userDAO.deleteUserByUsernameAndType(data.username, data.type);
        var res = await userDAO.getListUsers();
        expect(res.length).toStrictEqual(5);
    });
}


function testGetUserByUserAndPass(data) {
    test('get user', async () => {
        await userDAO.createNewUser(data);
        res = await userDAO.getUserByUsernameAndPass(data.username, data.password);
        expect(res.email).toStrictEqual(data.username);
        expect(res.name).toStrictEqual(data.name);
        expect(res.surname).toStrictEqual(data.surname);
        expect(res.password).toStrictEqual(data.password);
        expect(res.type).toStrictEqual(data.type);
    })
}

function testGetSuppliers() {
    test('get suppliers', async () => {
        const data = {
            name: 'Flavio',
            surname: 'Gialli',
            email: 'supplier1@ezwh.com'
        }
        res = await userDAO.getListSuppliers();
        expect(res[0].name).toStrictEqual(data.name);
        expect(res[0].surname).toStrictEqual(data.surname);
        expect(res[0].email).toStrictEqual(data.email);
    })
}


function testModifyUser(data) {
    test('modify user', async () => {
        const newData = {
            "oldType": 'customer',
            "newType": 'deliveryEmployee'
        }
        await userDAO.createNewUser(data);
        var res = await userDAO.getListUsers();
        expect(res.length).toStrictEqual(6);

        await userDAO.modifyRightsByUsername(newData, data.username);
        res = await userDAO.getUserByUsernameAndType(data.username, newData.newType);

        expect(res.email).toStrictEqual(data.username);
        expect(res.name).toStrictEqual(data.name);
        expect(res.surname).toStrictEqual(data.surname);
        expect(res.password).toStrictEqual(data.password);
        expect(res.type).toStrictEqual(newData.newType);
    });
}

