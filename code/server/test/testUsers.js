const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const userDAO = require('../modules/database/userDAO');


describe('test item apis', () => {

    beforeEach(async () => {
        await userDAO.deleteTableContent();
    });

    user1 = {
        "username": "user2@ezwh.com",
        "name": "John",
        "surname": "Smith",
        "password": "testpassword",
        "type": "customer"
    }
    user2 = {
        "username": "user2.ezwh.com",
        "name": "John",
        "surname": "Smith",
        "password": "testpassword",
        "type": "customer"
    }
    user3 = {
        "username": "user1@ezwh.com",
        "name": "John",
        "surname": "Smith",
        "password": "testpassword",
        "type": "customer"
    }
    user4 = {
        "username": "supplier2@ezwh.com",
        "name": "John",
        "surname": "Smith",
        "password": "testpassword",
        "type": "supplier"
    }

    mod = {
        "oldType": "customer",
        "newType": "supplier"
    }
    data = {
        "username": "manager1@ezwh.com",
        "password": "testpassword"
    }

    manager = {
        "id": 1,
        "name": "Mario",
        "surname": "Rossi",
        "email": "manager1@ezwh.com",
        "type": "manager"
    }

    newUser(201, user1); // create new user
    newUser(422, user2); // wrong username
    newUser(409, user3); // new user alredy exists
    getUsersNoManager(200); // get all users no Manager
    getSuppliers(200, user4); // get all suppliers
    modifyUserRights(200, user1, "user2@ezwh.com", mod) // modify user rights
    modifyUserRights(404, user1, "user5@ezwh.com", mod) // user not found
    modifyUserRights(422, user1, "user2.ezwh.com", mod) // wrong username
    loginManager(200, data, manager)
    logout(200);
    deleteUser(422, user1, "user3.ezwh.com", "customer") // wrong username
    deleteUser(204, user1, "user2@ezwh.com", "customer") //delete user

});

async function newUser(expectedHTTPStatus, user) {
    it('adding a new user', function (done) {
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (res.status == 200) {
                    agent.get('/api/users')
                        .then(function (r) {
                            r.should.have.status(200);
                            r.body.length.should.equal(6);
                        })
                }
                done();
            });
    });
}

function getUsersNoManager(expectedHTTPStatus) {
    it('getting user list from the system', function (done) {
        agent.get('/api/users')
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                r.body.length.should.equal(5);
                done();
            });
    });
}

function getSuppliers(expectedHTTPStatus, user) {
    it('getting user list from the system', function (done) {
        agent.post('/api/newUser')
            .send(user)
            .then(function (r) {
                r.should.have.status(201);
                agent.get('/api/suppliers')
                    .then(function (res) {
                        res.should.have.status(expectedHTTPStatus);
                        res.body.length.should.equal(2);
                        done();
                    });
            });
    });
}


function modifyUserRights(expectedHTTPStatus, user, username, mod) {
    it('modify user rights', function (done) {
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                agent.put('/api/users/' + username)
                    .send(mod)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        if (r.status == 200) {
                            agent.get('/api/suppliers')
                                .then(function (re) {
                                    re.should.have.status(200);
                                    re.body.length.should.equal(2);
                                });
                        }
                        done();
                    })
            });
    });
}

function loginManager(expectedHTTPStatus, data, manager) {
    it('login manager', function (done) {
        agent.post('/api/managerSessions')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (res.status == 200) {
                    agent.get('/api/userinfo')
                        .then(function (r) {
                            r.body.id.should.equal(manager.id);
                            r.body.username.should.equal(manager.username);
                            r.body.name.should.equal(manager.name);
                            r.body.surname.should.equal(manager.surname);
                            r.body.type.should.equal(manager.type);
                        })
                }
                done();
            })
    });
}

function logout(expectedHTTPStatus) {
    it('logout ', function (done) {
        agent.post('/api/managerSessions')
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                agent.post('/api/logout') 
                .then(function (r1) {
                    r1.should.have.status(expectedHTTPStatus)
                    agent.get('/api/userinfo')
                        .then(function (r) {
                            r.body.id.should.equal(null)
                        })
                })
                done();
            })
    });
}

function deleteUser(expectedHTTPStatus, user, username, type) {
    it('delete user', function (done) {
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                agent.delete('/api/users/' + username + '/' + type)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        if (r.status == 204) {
                            agent.get('/api/users')
                                .then(function (re) {
                                    re.should.have.status(200);
                                    re.body.length.should.equal(5);
                                });
                        }
                        done();
                    })
            });
    });
}

