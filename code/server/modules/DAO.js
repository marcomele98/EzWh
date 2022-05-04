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

// function for Internal Order
    newTableInternalOrder() {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS internalOrders(ID integer PRIMARY KEY AUTOINCREMENT, ISSUEDATE STRING, STATE STRING, PRODUCTS STRING, CUSTOMERID STRING )';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    storeInternalOrder(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO internalOrders (ID, ISSUEDATE, STATE, PRODUCTS, CUSTOMERID) VALUES(?, ?, ?, ?, ?)';
            this.db.run(sql, [this.lastID, data.issueDate, 'ISSUED', data.products, data.customerId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    getListInternalOrders() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM internalOrders';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const internalOrders = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        products: r.PRODUCTS,
                        customerId: r.CUSTOMERID
                    }
                ));
                resolve(internalOrders);
            });
        });
    }

    getListIssuedInternalOrders() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM internalOrders WHERE STATE = ?';
            this.db.all(sql, ['ISSUED'], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const internalOrders = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        products: r.PRODUCTS,
                        customerId: r.CUSTOMERID
                    }
                ));
                resolve(internalOrders);
            });
        });
    }

    getListAcceptedInternalOrders() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM internalOrders WHERE STATE = ?';
            this.db.all(sql, ['ACCEPTED'], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const internalOrders = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        products: r.PRODUCTS,
                        customerId: r.CUSTOMERID
                    }
                ));
                resolve(internalOrders);
            });
        });
    }

    getInternalOrderById = (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM internalOrders WHERE ID = ?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const internalOrder = rows.map((r) => (
                    {
                        id: r.ID,
                        issueDate: r.ISSUEDATE,
                        state: r.STATE,
                        products: r.PRODUCTS,
                        customerId: r.CUSTOMERID
                    }
                ));
                resolve(internalOrder);
            });
        });
    }

    deleteInternalOrderById = (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM internalOrders WHERE ID = ?';
            this.db.run(sql, [id], (err) => {
                if (err)
                    reject(err);
                else
                    resolve(null);
            });
        });
    };



// function for Item
    newTableItem() {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS items(ID INTEGER PRIMARY KEY , DESCRIPTION STRING, PRICE FLOAT, SKUID INTEGER, SUPPLIERID INTEGER )';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(null);
            });
        });
    }

    storeItem(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO items (id, description, price, skuId, supplierId) VALUES(?, ?, ?, ?, ?)';
            this.db.run(sql, [data.id, data.description, data.price, data.SKUId, data.supplierId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(null);
            });
        });
    }

    getListItems() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM items';
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const items = rows.map((r) => (
                    {
                        id: r.ID,
                        description: r.DESCRIPTION,
                        price: r.PRICE,
                        skuId: r.SKUID,
                        supplierId: r.SUPPLIERID
                    }
                ));
                resolve(items);
            });
        });
    }

    getItemById = (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM items WHERE ID = ?';
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                const item = rows.map((r) => (
                    {
                        id: r.ID,
                        description: r.DESCRIPTION,
                        price: r.PRICE,
                        skuId: r.SKUID,
                        supplierId: r.SUPPLIERID
                    }
                ));
                resolve(item);
            });
        });
    }

    getSkuBySupplier = (skuId, supplierId) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM items WHERE SKUID = ? AND SUPPLIERID = ?';
            this.db.all(sql, [skuId, supplierId], function(err, rows) {
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
        )
    } 

    modifyItemById = (id, data) => {
        return new Promise((resolve, reject) => {
            const updateQuery = 'UPDATE items SET DESCRIPTION = ?, PRICE = ? WHERE ID = ?';
            this.db.run(updateQuery, [data.newDescription, data.newPrice, id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(null);
            });
        });
    };


    deleteItemById = (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM items WHERE ID = ?';
            this.db.run(sql, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(null);
            });
        });
    };

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

/* ------------ POSITION METHODS-------------------- */

    // this fn returns the list of all positions in the database
    this.getListAllPositionsWH = () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM positions';
            this.db.all(sql, [], (err, rows) => {
                if(err)
                    reject(err);
                else {
                    const positions = rows.map(dbrow => ({
                        id: dbrow.id,
                        aisle : dbrow.id,
                        row : dbrow.row,
                        column : dbrow.column,
                        maxWeight : dbrow.maxWeight,
                        maxVolume : dbrow.maxVolume,
                        occupiedWeight : dbrow.occupiedWeight,
                        occupiedVolume : dbrow.occupiedVolume
                    }));
                    resolve(positions);
                }
            });
        });
    }

    // this fn deletes a position in the database give its id. Returns a boolean
    this.deletePositionWHByID = (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM positions WHERE id = ?';
            this.db.run(sql, [id], function(err) {
              if(err) reject(err);
              else {
                  if(this.changes !== 0) resolve(true);
                  else resolve(false);
              }
            });
        });
    }

    // this fn modifies the id of a position, leaving all its other attributes unmodified
    this. modifyPositionID = (oldId, newId) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE positions SET id = ? WHERE id = ?';
            this.db.run(sql, [newId, oldId], function(err) {
              if(err) reject(err);
              else {
                  if(this.changes !== 0) resolve(true);
                  else resolve(false);
              }
            });
        });
    }

    //fn that modifies the attributes of a position tuple in db. Returns a boolean
    this.modifyPositionAttributes = (id, aisle, row, column, maxWeight, maxVolume, occupiedWeight, occupiedVolume) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE positions SET aisle = ?, row = ?, column = ?, maxWeight= ?, maxVolume= ?, occupiedWeight= ?, occupiedVolume= ? WHERE id = ?';
            this.db.run(sql, [aisle, row, column, maxWeight, maxVolume, occupiedWeight, occupiedVolume, id], function(err) {
              if(err) reject(err);
              else {
                  if(this.changes !== 0) resolve(true);
                  else resolve(false);
              }
            });
        });
    }

    //fn that creates a new tuple of position in db. Return a boolean.
    this.createNewPositionWH = (id, aisle, row, column, maxWeight, maxVolume, occupiedWeight, occupiedVolume) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO positions (id, aisle, row, column, maxWeight, maxVolume, occupiedWeight, occupiedVolume) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            this.db.run(sql, [id, aisle, row, column, maxWeight, maxVolume, occupiedWeight, occupiedVolume], function(err) {
              if(err) reject(err);
              else {
                  resolve(this.lastID);
              }
            });
        });
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
