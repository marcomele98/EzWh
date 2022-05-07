'use stric';

// TESTRESULTS (id, idTestDescriptor, Date, Result, rfid)

const db = require('./DAO');

exports.getTestResultsListByRfid = (rfid) => {
    const query = 'SELECT id, idTestDescriptor, Date, Result FROM TESTRESULTS WHERE rfid = ?';
    db.all(query, [rfid]);
}

exports.getTestResultByIds = (id, rfid) => {
    const query = 'SELECT id, idTestDescriptor, Date, Result FROM TESTRESULTS WHERE rfid = ? AND id = ?';
    db.get(query, [rfid, id]);
}

exports.createTestResultByRfid = () => {
    const query = '';
}

exports.modifyTestResultByIds = () => {
    const query = '';
}

exports.deleteTestResultByIds = (id, rfid) => {
    const query = 'DELETE FROM TESTRESULTS WHERE id = ? AND rfid = ?';
    db.run(query, [id, rfid]);
}

exports.newTableTestResults = () => {
    const query = 'CREATE TABLE IF NOT EXISTS TESTRESULTS (id NUMBER PRIMARY KEY, idTestDescriptor NUMBER, Date STRING, Result INTEGER, rfid STRING)';
    db.run(query, []);
}

this.newTableTestResults();