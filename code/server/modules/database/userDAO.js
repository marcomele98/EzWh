"use strict"

const db = require('./DAO');


exports.newTableUser = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, email STRING, name STRING, surname STRING, password STRING, type STRING )';
    return db.run(sql);
}

exports.createNewUser = (data) => {
    const sql = 'INSERT INTO users (id, email, name, surname, password, type) VALUES(?, ?, ?, ?, ?, ?)';
    return db.run(sql, [this.lastID, data.username, data.name, data.surname, data.password, data.type]);
}

exports.getUserByUsername = (username) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    return db.get(sql, [username]);
}

exports.getUserByUsernameAndPass = (username, password) => {
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    return db.get(sql, [username, password]);
}

exports.getListUsers = () => {
    const sql = 'SELECT id, name, surname, email, type FROM users WHERE type!="manager"';
    return db.all(sql, []);
}

exports.getListSuppliers = () => {
    const sql = 'SELECT id, name, surname, email FROM users WHERE type=="supplier"';
    return db.all(sql, []);
}

exports.modifyRightsByUsername = (data, username) => {
    const updateQuery = 'UPDATE users SET type = ? WHERE email =? AND type=?';
    return db.run(updateQuery, [data.newType, username, data.oldType]);
}

exports.deleteUserByUsernameAndType = (username, type) => {
    const sql = 'DELETE FROM users WHERE email = ? AND type = ?';
    return db.run(sql, [username, type]);
}


this.newTableUser();