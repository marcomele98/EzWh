"use strict"

function PositionManagement() {

    // this fn returns the list of all positions in the database
    this.getListAllPositionsWH = (db) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM positions';
            db.all(sql, [], (err, rows) => {
                if(err)
                    reject(err);
                else {
                    const positions = rows.map(row => mapToPosition(row));
                    resolve(positions);
                }
            });
        });
    }

    // this fn deletes a position in the database give its id. Returns a boolean
    this.deletePositionWHByID = (db, id) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM positions WHERE id = ?';
            db.run(sql, [id], function(err) {
              if(err) reject(err);
              else {
                  if(this.changes !== 0) resolve(true);
                  else resolve(false);
              }
            });
        });
    }

    // this fn modifies the id of a position, leaving all its other attributes unmodified
    this. modifyPositionID = (db, oldId, newId) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE positions SET id = ? WHERE id = ?';
            db.run(sql, [newId, oldId], function(err) {
              if(err) reject(err);
              else {
                  if(this.changes !== 0) resolve(true);
                  else resolve(false);
              }
            });
        });
    }

}