'use stric';

// TESTRESULTS (id, idTestDescriptor, Date, Result, rfid)

const db = require('./DAO');

exports.getLastID = () => {
    const query = 'SELECT MAX(id) AS last FROM TESTRESULTS';
    return db.get(query, []);
}

exports.getTestResultsListByRfid = (rfid) => {
    const query = 'SELECT id, idTestDescriptor, Date, Result FROM TESTRESULTS WHERE rfid = ?';
    return db.all(query, [rfid]);
}

exports.getTestResultByIds = (id, rfid) => {
    const query = 'SELECT id, idTestDescriptor, Date, Result FROM TESTRESULTS WHERE rfid = ? AND id = ?';
    return db.get(query, [rfid, id]);
}

exports.getPassByIds = (id, rfid) => {
    const query = 'SELECT rfid FROM TESTRESULTS WHERE rfid = ? AND Result = 1 AND id = ?';
    return db.get(query, [rfid, id]);
}

exports.createTestResultByRfid = (id, data) => {
    const query = 'INSERT INTO TESTRESULTS(id, idTestDescriptor, Date, Result, rfid) VALUES (?, ?, ?, ?, ?)';
    return db.run(query, [id, data.idTestDescriptor, data.Date, data.Result, data.rfid])
}

exports.modifyTestResultByIds = (id, data, rfid) => {
    const query = 'UPDATE TESTRESULTS SET idTestDescriptor= ?, Date= ?, Result= ? WHERE id= ? AND rfid= ?';
    return db.run(query, [data.newIdTestDescriptor, data.newDate, data.newResult, id, rfid]);
}

exports.deleteTestResultByIds = (id, rfid) => {
    const query = 'DELETE FROM TESTRESULTS WHERE id = ? AND rfid = ?';
    return db.run(query, [id, rfid]);
}

exports.deleteTestResultsByIdTestDescriptor = (idTestDescriptor) => {
    const query = 'DELETE FROM TESTRESULTS WHERE idTestDescriptor = ?';
    return db.run(query, [idTestDescriptor]);
}

exports.deleteTableContent= () => {
    const query = 'DELETE FROM TESTRESULTS';
    return db.run(query, []);
}

exports.newTableTestResults = () => {
    const query = 'CREATE TABLE IF NOT EXISTS TESTRESULTS (id NUMBER, idTestDescriptor NUMBER, Date TEXT, Result INTEGER, rfid TEXT, PRIMARY KEY(id), FOREIGN KEY (rfid) REFERENCES skuItem(RFID), FOREIGN KEY (idTestDescriptor) REFERENCES TESTDESCRIPTORS(id))';
    return db.run(query, []);
}

this.newTableTestResults();