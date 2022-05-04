"use strict"

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

    newTableItem() {
        return new Promise((resolve, reject) => {
            const sql = 'CREATE TABLE IF NOT EXISTS items(ID integer PRIMARY KEY AUTOINCREMENT, DESCRIPTION STRING, PRICE FLOAT, SKUID STRING, SUPPLIERID STRING )';
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    storeItem(data) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO items (id, description, price, skuId, supplierId) VALUES(?, ?, ?, ?, ?)';
            this.db.run(sql, [this.lastID, data.description, data.price, data.skuId, data.supplierId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
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

    modifyItemById = (id, data) => {
        return new Promise((resolve, reject) => {
            const updateQuery = 'UPDATE items SET DESCRIPTION = ?, PRICE = ? WHERE ID = ?';
            this.db.run(updateQuery, [data.newDescription, data.newPrice, id], (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    };


    deleteItemById = (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM items WHERE ID = ?';
            this.db.run(sql, [id], (err) => {
                if (err)
                    reject(err);
                else
                    resolve(null);
            });
        });
    };
}

module.exports = DAO;
