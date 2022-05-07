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

module.exports = DAO;
