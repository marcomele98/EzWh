"use strict"

function TestManagement() {

    // --------------------------------------- FUNCTIONS FOR TEST DESCRIPTORS --------------------------------------

    // fn that inserts a new test descriptor in the db. Returns a boolean
    this.createTestDescriptor = (db, id, name, procedure, idSku) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO test_descriptors (id, name, procedure, idSku) VALUES (?, ?, ?, ?)';
            db.run(sql, [id, name, procedure, idSku], function(err) {
              if(err) reject(err);
              else {
                  if(this.changes !== 0) resolve(true);
                  else resolve(false);
              }
            });
        });
    }

    // fn that get list of all test descriptors in db
    this.getListTestDescriptors = (db) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM test_descriptors';
            db.all(sql, [], (err, rows) => {
                if(err)
                    reject(err);
                else {
                    const testDescriptors = rows.map(row => mapToTestDescriptor(row));
                    resolve(testDescriptors);
                }
            });
        });
    }

        // fn that get a test descriptors given its id.
        this.getTestDescriptorByID = (db, id) => {
            return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM test_descriptors WHERE id=?';
                db.get(sql, [id], (err, row) => {
                    if(err)
                        reject(err);
                    else {
                        const testDescriptor = mapToTestDescriptor(row);
                        resolve(testDescriptor);
                    }
                });
            });
        }

    // fn that modifies a test descriptor given its id. Return a boolean
    this.modifyTestDescriptorByID = (db, id, name, procedure, idSku) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE test_descriptors SET name=?, procedure=?, idSku=?, WHERE id = ?';
            db.run(sql, [name, procedure, idSku, id], function(err) {
              if(err) reject(err);
              else {
                  if(this.changes !== 0) resolve(true);
                  else resolve(false);
              }
            });
        });
    }

    // fn that deletes a test descriptor given its id form db. Returns a boolean
    this.deleteTestDescriptorByID = (db, id) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM test_descriptors WHERE id=?';
            db.run(sql, [id], function(err) {
              if(err) reject(err);
              else {
                  if(this.changes !== 0) resolve(true);
                  else resolve(false);
              }
            });
        });
    }

    // --------------------------------------- FUNCTIONS FOR TEST RESULTS --------------------------------------

    // fn that returns a list of all test results in db for a given sku item
    this.getAllTestResultsForRFID = (db, rfid) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT t.id AS id, t.date AS date, t.result AS result, t.idTestDescriptor AS idTestDescriptor FROM test_results t, sku_items s WHERE s.rfid=? AND s.testId=t.id';
            db.all(sql, [rfid], (err, rows) => {
                if(err)
                    reject(err);
                else {
                    const testResults = rows.map(row => mapToTestResult(row));
                    resolve(testResults);
                }
            });
        });
    }

    // fn that returns a single test result of a sku item given its id
    this.getTestResultForRFID = (db, rfid, testId) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT t.id AS id, t.date AS date, t.result AS result, t.idTestDescriptor AS idTestDescriptor FROM test_results t, sku_items s WHERE s.rfid=? AND s.testId=t.id AND t.id =?';
            db.get(sql, [rfid, testId], (err, row) => {
                if(err)
                    reject(err);
                else {
                    const testResult = mapToTestResult(row);
                    resolve(testResult);
                }
            });
        });
    }

    // fn that inserts in the db a new test result. Returns a boolean
    this.insertNewTestResult = (db, id, date, result, idTestDescriptor) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO test_results (id, date, result, idTestDescriptor) VALUES (?, ?, ?, ?)';
            db.run(sql, [id, date, result, idTestDescriptor], function(err) {
              if(err) reject(err);
              else {
                  if(this.changes !== 0) resolve(true);
                  else resolve(false);
              }
            });
        });
    }

    // fn that modifies the attributes of a test-result given its id. Returns a boolean
    this.modifyTestResult = (db, id, date, result, idTestDescriptor) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE test_results SET date=?, result=?, idTestDescriptor=?, WHERE id = ?';
            db.run(sql, [date, result, idTestDescriptor, id], function(err) {
              if(err) reject(err);
              else {
                  if(this.changes !== 0) resolve(true);
                  else resolve(false);
              }
            });
        });
    }

    // fn that deletes a test result from the db. Returns a boolean
    this.deleteTestResult = (db, id) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM test_results WHERE id=?';
            db.run(sql, [id], function(err) {
              if(err) reject(err);
              else {
                  if(this.changes !== 0) resolve(true);
                  else resolve(false);
              }
            });
        });
    }
}