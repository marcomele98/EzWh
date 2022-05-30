"use strict"

const sqlite = require('sqlite3');
const db = new sqlite.Database('database', (err) => {
    if (err) throw err;
});

exports.all = (stmt, params) => {
    return new Promise((res, rej) => {
        db.all(stmt, params, (error, result) => {
            if (error) {
                return rej(error.message);
            }
            return res(result);
        });
    })
}

exports.get = (stmt, params) => {
    return new Promise((res, rej) => {
        db.get(stmt, params, (error, result) => {
            if (error) {
                return rej(error.message);
            }
            return res(result);
        });
    })
}

exports.run = (stmt, params) => {
    return new Promise((res, rej) => {
        db.run(stmt, params, (error, result) => {
            if (error) {
                return rej(error.message);
            }
            return res(result);
        });
    })
}
