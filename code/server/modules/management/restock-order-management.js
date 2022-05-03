function RestockOrderManagement() {

    // RESTOCK ORDER POST REQUESTS

    this.createNewRestockOrder = (db, id, issueDate, state, transportNote, idSupplier, SkuList, SkuItemList, SkuReturnItemList) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO restock_orders (id, issueDate, state, transportNote, idSupplier, SkuList, SkuItemList, SkuReturnItemList) VALUES (?, ?, ?, ?, ?, ?, ? ,? ,?)';
            db.run(sql, [id, issueDate, state, transportNote, idSupplier, SkuList, SkuItemList, SkuReturnItemList], function(err) {
              if(err) reject(err);
              else {
                  if(this.changes !== 0) resolve(true);
                  else resolve(false);
              }
            });
        });
    }

    // RESTOCK ORDER GET REQUESTS

    this.getListRestockOrder = (db) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM restock_orders';
            db.all(sql, [], (err, rows) => {
                if(err)
                    reject(err);
                else {
                    const restockOrders = rows.map(row => mapToRestockOrder(row));
                    resolve(restockOrders);
                }
            });
        });
    }

    this.getListIssuedRestockOrder = (db) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM restock_orders, WHERE state = issued';
            db.all(sql, [], (err, rows) => {
                if(err)
                    reject(err);
                else {
                    const restockOrders = rows.map(row => mapToRestockOrder(row));
                    resolve(restockOrders);
                }
            });
        });
    }

    this.getRestockOrderByID = (db, id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM restock_orders, WHERE id = ?';
            db.all(sql, [id], (err, rows) => {
                if(err)
                    reject(err);
                else {
                    const restockOrder = rows.map(row => mapToRestockOrder(row));
                    resolve(restockOrder);
                }
            });
        });
    }

    this.getListSKUItemsToReturn = (db, id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM restock_orders, WHERE id = ?';
            db.all(sql, [id], (err, rows) => {
                if(err)
                    reject(err);
                else {
                    const SkuItemList = rows.map(row => mapToSkuItemList(row));
                    resolve(SkuItemList);
                }
            });
        });
    }

    // RESTOCK ORDER PUT REQUESTS

    this.modifyStateRestockOrder = (db, id, state) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE restock_orders SET state=?, WHERE id = ?';
            db.run(sql, [id, state], function(err) {
              if(err) reject(err);
              else {
                  if(this.changes !== 0) resolve(true);
                  else resolve(false);
              }
            });
        });
    }

    this.addSKUItemsToRestockOrder = (db, id, SkuItemList) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE restock_orders SET SkuItemList=?, WHERE id = ?';
            db.run(sql, [id, SkuItemList], function(err) {
              if(err) reject(err);
              else {
                  if(this.changes !== 0) resolve(true);
                  else resolve(false);
              }
            });
        });
    }

    this.addTransportNotetoRestockOrder = (db, id, transportNote) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE restock_orders SET transportNote=?, WHERE id = ?';
            db.run(sql, [id, transportNote], function(err) {
              if(err) reject(err);
              else {
                  if(this.changes !== 0) resolve(true);
                  else resolve(false);
              }
            });
        });
    }

    this.deleteRestockOrderByID = (db, id) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM restock_orders WHERE id=?';
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