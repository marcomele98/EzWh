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
newTableSku() {
    return new Promise((resolve, reject) => {
        const sql = 'CREATE TABLE IF NOT EXISTS sku(ID integer PRIMARY KEY AUTOINCREMENT, DESCRIPTION STRING, WEIGHT FLOAT, VOLUME FLOAT, PRICE FLOAT, NOTES STRING, AVAILABLEQUANTITY INTEGER, POSITIONID INTEGER, TESTLIST STRING)';
        this.db.run(sql, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
}

    /*function to have the list of all sku (1°API of SKU)*/
    getSkuList = () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM sku';
            this.db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
                else {
                    const skuList = rows.map((r) => ({
                        id : r.ID,
                        description: r.DESCRIPTION,
                        weight: r.WEIGHT,
                        volume: r.VOLUME,
                        price : r.PRICE,
                        notes : r.NOTES,
                        availableQuantity: r.AVAILABLEQUANTITY,
                        positionId: r.POSITIONID,
                        testList: r.TESTLIST
                    }));
                    resolve(skuList);
                }
            });
        });
    }

    /*function to have a specified sku given its id (2°API of SKU)*/
    getSkuById= (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM sku WHERE ID = ?';
            this.db.all(sql, [id], function(err, rows) {
              if(err) {
              reject(err);
              return;
            }
            const sku = rows.map((r) => (
                {
                    id : r.ID,
                    description: r.DESCRIPTION,
                    weight: r.WEIGHT,
                    volume: r.VOLUME,
                    price : r.PRICE,
                    notes : r.NOTES,
                    availableQuantity: r.AVAILABLEQUANTITY,
                    positionId: r.POSITIONID,
                    testList: r.TESTLIST
                }));
            resolve(sku);
            })}
        )}

     /*function to add a sku with an empty array of TestDescriptors (3° API of SKU)*/
     addSku = (data) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO sku (ID, DESCRIPTION, WEIGHT, VOLUME, PRICE, NOTES, AVAILABLEQUANTITY) VALUES (?, ?, ?, ?, ?, ?, ?)';
            this.db.run(sql, [this.lastID, data.description, data.weight, data.volume, data.price, data.notes, data.availableQuantity], function(err) {
              if(err) {
                  reject(err);
                  return;
                }
              resolve(this.lastID);
            });
        });
    }

    
    /*function to delete a sku given its id (6° API of SKU)*/
    deleteSkuById = (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM sku WHERE ID = ?';
            this.db.run(sql, [id], function(err) {
              if(err) 
              reject(err);
              else {
                  if(this.changes !== 0) resolve(true);
                  else resolve(false);
              }
            });
        });
    }
 
    updateSkuInfo = (id, data) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE sku SET DESCRIPTION = ? WEIGTH = ? VOLUME = ? PRICE = ? NOTES = ? AVAILABLEQUANTITY = ? POSITIONID= ? WHERE ID = ?';
            this.db.run(sql, [data.newDescription, data.newWeight, data.newVolume, data.newPrice, data.newNotes, 
                data.newAvailableQuantity,data.newPositionId, id], function(err){
                if(err)
                reject(err);
                else{
                    if (oldAvailableQuantity !== newAvailableQuantity){
                        const trigger = 'CREATE TRIGGER updatePosition ON sku AFTER UPDATE AS UPDATE INTO position SET OCCUPIEDWEIGTH = ? , OCCUPIEDVOLUME= ? WHERE ID = ?';
                        this.db.run(trigger, [newWeight,newVolume, id ], function(err){
                            if(err)
                            reject(err);
                            else{
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
        return new Promise ((resolve,reject) => {
            const sql = 'UPDATE SKU SET positionId = ? where id = ?'
            this.db.run(sql,[positionId, id], function(err){
                if(err)
                reject(err);
                else{
                    const position = row.map(row => newSku (row.positionId))
                    resolve(position);
                }
            });
        });

    }

}


    // --------------------------------------- FUNCTIONS FOR TEST DESCRIPTORS --------------------------------------

    // fn that inserts a new test descriptor in the db. Returns a boolean
    this.createTestDescriptor = (id, name, procedure, idSku) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO test_descriptors (id, name, procedure, idSku) VALUES (?, ?, ?, ?)';
            this.db.run(sql, [id, name, procedure, idSku], function(err) {
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
                if(err)
                    reject(err);
                else {
                    const testDescriptors = rows.map( dbRow => ({
                        id : dbRow.id, 
                        name: dbRow.name, 
                        procedure: dbRow.procedure, 
                        idSku: dbRow.idSku
                    }) );
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
                    if(err)
                        reject(err);
                    else {
                        const testDescriptor = row.map( dbRow => ({
                            id : dbRow.id, 
                            name: dbRow.name, 
                            procedure: dbRow.procedure, 
                            idSku: dbRow.idSku
                        }) );
                        resolve(testDescriptor);
                    }
                });
            });
        }

    // fn that modifies a test descriptor given its id. Return a boolean
    this.modifyTestDescriptorByID = (id, name, procedure, idSku) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE test_descriptors SET name=?, procedure=?, idSku=?, WHERE id = ?';
            this.db.run(sql, [name, procedure, idSku, id], function(err) {
              if(err) reject(err);
              else {
                  if(this.changes !== 0) resolve(true);
                  else resolve(false);
              }
            });
        });
    }

    // fn that deletes a test descriptor given its id form db. Returns a boolean
    this.deleteTestDescriptorByID = (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM test_descriptors WHERE id=?';
            this.db.run(sql, [id], function(err) {
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

    // fn that modifies the attributes of a test-result given its id. Returns a boolean
    this.modifyTestResult = (id, date, result, idTestDescriptor) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE test_results SET date=?, result=?, idTestDescriptor=?, WHERE id = ?';
            this.db.run(sql, [date, result, idTestDescriptor, id], function(err) {
              if(err) reject(err);
              else {
                  if(this.changes !== 0) resolve(true);
                  else resolve(false);
              }
            });
        });
    }

    // fn that deletes a test result from the db. Returns a boolean
    this.deleteTestResult = (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM test_results WHERE id=?';
            this.db.run(sql, [id], function(err) {
              if(err) reject(err);
              else {
                  if(this.changes !== 0) resolve(true);
                  else resolve(false);
              }
            });
        });
    }

module.exports = DAO;
