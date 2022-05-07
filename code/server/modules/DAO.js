"use strict"

// nomi tabelle

// items (ID, DESCRIPTION, PRICE, SKUID, SUPPLIERID)
// internalOrders (ID, ISSUEDATE, STATE, PRODUCTS, CUSTOMERID)

class DAO {

    sqlite = require('sqlite3');

    constructor(database) {
        this.db = new this.sqlite.Database(database, (err) => {
            if (err) throw err;
        });
    }

    dropTable() {
        return new Promise((resolve, reject) => {
            const sql = 'DROP TABLE IF EXISTS NAMES';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }



    /*-------------SKU METHODS-------------*/


    updateSkuInfo = (id, data) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE sku SET DESCRIPTION = ? WEIGTH = ? VOLUME = ? PRICE = ? NOTES = ? AVAILABLEQUANTITY = ? POSITIONID= ? WHERE ID = ?';
            this.db.run(sql, [data.newDescription, data.newWeight, data.newVolume, data.newPrice, data.newNotes,
            data.newAvailableQuantity, data.newPositionId, id], function (err) {
                if (err)
                    reject(err);
                else {
                    if (oldAvailableQuantity !== newAvailableQuantity) {
                        const trigger = 'CREATE TRIGGER updatePosition ON sku AFTER UPDATE AS UPDATE INTO position SET OCCUPIEDWEIGTH = ? , OCCUPIEDVOLUME= ? WHERE ID = ?';
                        this.db.run(trigger, [newWeight, newVolume, id], function (err) {
                            if (err)
                                reject(err);
                            else {
                                resolve(null);
                            }
                        });
                    }
                    resolve(null);
                }
            });
        });

    }

    updatePositionOfSku = (positionId, id) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE SKU SET positionId = ? where id = ?'
            this.db.run(sql, [positionId, id], function (err) {
                if (err)
                    reject(err);
                else {
                    const position = row.map(row => newSku(row.positionId))
                    resolve(position);
                }
            });
        });

    }

}
    // --------------------------------------- FUNCTIONS FOR TEST RESULTS --------------------------------------

    // fn that returns a list of all test results in db for a given sku item
    this.getAllTestResultsForRFID = (rfid) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT t.id AS id, t.date AS date, t.result AS result, t.idTestDescriptor AS idTestDescriptor FROM test_results t, sku_items s WHERE s.rfid=? AND s.testId=t.id';
            this.db.all(sql, [rfid], (err, rows) => {
                if(err)
                    reject(err);
                else {
                    const testResults = rows.map( dbRow => ({id : dbRow.id, 
                        date: dbRow.date, 
                        result: dbRow.result,
                        idTestDescriptor: dbRow.idTestDescriptor}) );
                    resolve(testResults);
                }
            });
        });
    }

    // fn that returns a single test result of a sku item given its id
    this.getTestResultForRFID = (rfid, testId) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT t.id AS id, t.date AS date, t.result AS result, t.idTestDescriptor AS idTestDescriptor FROM test_results t, sku_items s WHERE s.rfid=? AND s.testId=t.id AND t.id =?';
            this.db.get(sql, [rfid, testId], (err, row) => {
                if(err)
                    reject(err);
                else {
                    const testResult = row.map( dbRow => ({id : dbRow.id, 
                        date: dbRow.date, 
                        result: dbRow.result,
                        idTestDescriptor: dbRow.idTestDescriptor}) );
                    resolve(testResult);
                }
            });
        });
    }

    // fn that inserts in the db a new test result. Returns a boolean
    this.insertNewTestResult = (id, date, result, idTestDescriptor) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO test_results (id, date, result, idTestDescriptor) VALUES (?, ?, ?, ?)';
            this.db.run(sql, [id, date, result, idTestDescriptor], function(err) {
              if(err) reject(err);
              else {
                resolve(this.lastID);
            }
        });
    });
}

// fn that get list of all test descriptors in db
this.getListTestDescriptors = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM test_descriptors';
        this.db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else {
                const testDescriptors = rows.map(dbRow => ({
                    id: dbRow.id,
                    name: dbRow.name,
                    procedure: dbRow.procedure,
                    idSku: dbRow.idSku
                }));
                resolve(testDescriptors);
            }
        });
    });
}

// fn that get a test descriptors given its id.
this.getTestDescriptorByID = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM test_descriptors WHERE id=?';
        this.db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else {
                const testDescriptor = row.map(dbRow => ({
                    id: dbRow.id,
                    name: dbRow.name,
                    procedure: dbRow.procedure,
                    idSku: dbRow.idSku
                }));
                resolve(testDescriptor);
            }
        });
    });
}

// fn that modifies a test descriptor given its id. Return a boolean
this.modifyTestDescriptorByID = (id, name, procedure, idSku) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE test_descriptors SET name=?, procedure=?, idSku=?, WHERE id = ?';
        this.db.run(sql, [name, procedure, idSku, id], function (err) {
            if (err) reject(err);
            else {
                if (this.changes !== 0) resolve(true);
                else resolve(false);
            }
        });
    });
}

// fn that deletes a test descriptor given its id form db. Returns a boolean
this.deleteTestDescriptorByID = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM test_descriptors WHERE id=?';
        this.db.run(sql, [id], function (err) {
            if (err) reject(err);
            else {
                if (this.changes !== 0) resolve(true);
                else resolve(false);
            }
        });
    });
}

// --------------------------------------- FUNCTIONS FOR TEST RESULTS --------------------------------------

// fn that returns a list of all test results in db for a given sku item
this.getAllTestResultsForRFID = (rfid) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT t.id AS id, t.date AS date, t.result AS result, t.idTestDescriptor AS idTestDescriptor FROM test_results t, sku_items s WHERE s.rfid=? AND s.testId=t.id';
        this.db.all(sql, [rfid], (err, rows) => {
            if (err)
                reject(err);
            else {
                const testResults = rows.map(dbRow => ({
                    id: dbRow.id,
                    date: dbRow.date,
                    result: dbRow.result,
                    idTestDescriptor: dbRow.idTestDescriptor
                }));
                resolve(testResults);
            }
        });
    });
}

// fn that returns a single test result of a sku item given its id
this.getTestResultForRFID = (rfid, testId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT t.id AS id, t.date AS date, t.result AS result, t.idTestDescriptor AS idTestDescriptor FROM test_results t, sku_items s WHERE s.rfid=? AND s.testId=t.id AND t.id =?';
        this.db.get(sql, [rfid, testId], (err, row) => {
            if (err)
                reject(err);
            else {
                const testResult = row.map(dbRow => ({
                    id: dbRow.id,
                    date: dbRow.date,
                    result: dbRow.result,
                    idTestDescriptor: dbRow.idTestDescriptor
                }));
                resolve(testResult);
            }
        });
    });
}

// fn that inserts in the db a new test result. Returns a boolean
this.insertNewTestResult = (id, date, result, idTestDescriptor) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO test_results (id, date, result, idTestDescriptor) VALUES (?, ?, ?, ?)';
        this.db.run(sql, [id, date, result, idTestDescriptor], function (err) {
            if (err) reject(err);
            else {
                resolve(this.lastID);
            }
        });
    });
}

// fn that modifies the attributes of a test-result given its id. Returns a boolean
this.modifyTestResult = (id, date, result, idTestDescriptor) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE test_results SET date=?, result=?, idTestDescriptor=?, WHERE id = ?';
        this.db.run(sql, [date, result, idTestDescriptor, id], function (err) {
            if (err) reject(err);
            else {
                if (this.changes !== 0) resolve(true);
                else resolve(false);
            }
        });
    });
}

// fn that deletes a test result from the db. Returns a boolean
this.deleteTestResult = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM test_results WHERE id=?';
        this.db.run(sql, [id], function (err) {
            if (err) reject(err);
            else {
                if (this.changes !== 0) resolve(true);
                else resolve(false);
            }
        });
    });
}

module.exports = DAO;
