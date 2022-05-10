'use stric';

// TESTDESCRIPTORS (id, name, procedureDescription, idSKU)

const db = require('./DAO');

exports.newTableTestDescriptors = () => {
    const query = 'CREATE TABLE IF NOT EXISTS TESTDESCRIPTORS (id NUMBER, name STRING, procedureDescription STRING, idSKU NUMBER,  PRIMARY KEY(id), FOREIGN KEY(idSKU) REFERENCES sku(id))';
    return db.run(query, []);
}

exports.getLastID = () => {
    const query = 'SELECT MAX(id) AS last FROM TESTDESCRIPTORS';
    return db.get(query, []);
}

exports.createTestDescriptor = (id, data) => {
    const query = 'INSERT INTO TESTDESCRIPTORS(id, name, procedureDescription, idSKU) VALUES(?, ?, ?, ?)';
    return db.run(query, [id, data.name, data.procedureDescription, data.idSKU]);
}

exports.getListTestDescriptors = () => {
    const query = 'SELECT * FROM TESTDESCRIPTORS';
    return db.all(query, []);
}

exports.getTestDescriptorByID = (id) => {
    const query = 'SELECT * FROM TESTDESCRIPTORS WHERE id = ?';
    return db.get(query, [id]);
}

exports.modifyTestDescriptorByID = (id, data) => {
    const query = 'UPDATE TESTDESCRIPTORS SET name = ?, procedureDescription= ?, idSKU= ? WHERE id = ?';
    return db.run(query, [id, data.newName, data.newProcedureDescription, data.newIdSKU]);
}

exports.deleteTestDescriptorByID = (id) => {
    const query = 'DELETE FROM TESTDESCRIPTORS WHERE id = ?';
    return db.run(query, [id]);
}

exports.getTestListBySKU = (id) => {
    const sql = 'SELECT id FROM TESTDESCRIPTORS WHERE idSKU = ?'
    return db.all(sql, [id]);
}
this.newTableTestDescriptors();