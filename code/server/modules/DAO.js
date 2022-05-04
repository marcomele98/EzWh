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

module.exports = DAO;
