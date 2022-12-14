"use strict"

const db = require('./DAO');


exports.newTableUser = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, name TEXT, surname TEXT, password TEXT, type TEXT )';
    return db.run(sql);
}

exports.createNewUser = (data) => {
    const sql = 'INSERT INTO users (id, email, name, surname, password, type) VALUES(?, ?, ?, ?, ?, ?)';
    return db.run(sql, [this.lastID, data.username, data.name, data.surname, data.password, data.type]);
}

exports.getUserByUsernameAndType = (username, type) => {
    const sql = 'SELECT * FROM users WHERE email = ? AND type=?';
    return db.get(sql, [username, type]);
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

exports.deleteTableContent = () => {
    const query = 'DELETE FROM users WHERE id>6';
    db.run(query, []);
    const query2 = 'UPDATE sqlite_sequence SET seq=6 WHERE name=?';
    return db.run(query2, ['users']);
}

this.newTableUser();