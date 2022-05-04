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
            this.db.run(sql, [this.lastID, data.description, data.price, data.SKUId, data.supplierId], (err) => {
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
            this.db.all(updateQuery, [data.newDescription, data.newPrice, id], (err, rows) => {
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
