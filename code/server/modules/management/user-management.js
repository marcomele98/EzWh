"use strict"

const db = require('../database/userDAO');

const possibleType = ['customer', 'qualityEmployee', 'clerk', 'deliveryEmployee', 'supplier']

class UserManagement {

    constructor() { }


    async createNewUser(req, res) {
        let user = req.body;
        if (user == '' || user == undefined || user.username == undefined || user.username === ''
            || user.name == '' || user.name == undefined || user.surname == ''
            || user.surname == undefined || user.password == '' || user.password == undefined
            || user.type == '' || user.type == undefined || user.type == 'manager' || user.type == 'administrator'
            || this.ValidateEmail(user.username) != true) {
            return res.status(422).end();
        }
        try {
            const usr = await db.getUserByUsername(user.username);
            if (usr != undefined && usr.email == user.username && usr.type == user.type) {
                return res.status(409).end();
            } else {
                await db.createNewUser(user);
                res.status(201).end();
            }
        } catch (err) {
            res.status(503).end();
        }
    }

    async getListUsers(req, res) {
        try {
            const listUsers = await db.getListUsers();
            res.status(200).json(listUsers);
        } catch (err) {
            res.status(500).end();
        }
    }

    async getListSuppliers(req, res) {
        try {
            const listSuppliers = await db.getListSuppliers();
            res.status(200).json(listSuppliers);
        } catch (err) {
            res.status(500).end();
        }
    }

    async deleteUserByUsernameAndType(req, res) {
        const username = req.params.username;
        const type = req.params.type;
        if (username == undefined || username == '' || type == undefined || type == '' ||
            type == 'manager' || type == 'administrator') {
            return res.status(422).end();
        }
        try {
            await db.deleteUserByUsernameAndType(username, type);
            res.status(204).end();
        } catch (err) {
            res.status(503).end();
        }
    }

    async modifyRightsByUsername(req, res) {
        const username = req.params.username;
        const data = req.body;
        const user = await db.getUserByUsername(username);
        if ( data.oldType == undefined || data.oldType == '' || data.newType == undefined || data.newType == '' 
            || username == undefined || username == '' || this.CheckPossibleType(data.oldType) != true 
            || this.CheckPossibleType(data.newType) != true || this.CheckPossibleType(user.type) != true 
            || this.ValidateEmail(username) != true) {
            return res.status(422).end();
        } 
        try {
            if( user == undefined || user.email != username || user.type != data.oldType ){
                return res.status(404).end();
            } else {
                await db.modifyRightsByUsername(data, username);
                res.status(200).end();
            }
        } catch(err) {
            res.status(503).end();
        }
    }

    ValidateEmail(input) {
        var validRegex = /^(?=.{1,64}@)((?:[A-Za-z0-9!#\$%&'\*\+\-/=\?\^_`\{\|\}~]+|"(?:\\"|\\\\|[A-Za-z0-9\.!#\$%&'\*\+\-/=\?\^_`\{\|\}~ \(\),:;<>@\[\]\.])+")(?:\.(?:[A-Za-z0-9!#\$%&'\*\+\-/=\?\^_`\{\|\}~]+|"(?:\\"|\\\\|[A-Za-z0-9\.!#\$%&'\*\+\-/=\?\^_`\{\|\}~ \(\),:;<>@\[\]\.])+"))*)@(?=.{1,255}\.)((?:[A-Za-z0-9]+(?:(?:[A-Za-z0-9\-]*[A-Za-z0-9])?)\.)+[A-Za-z]{2,})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,6}(0|)])$/
        if (input.match(validRegex)) {
            return true;
        } else {
            return false;
        }
    }

    CheckPossibleType(type) {
        return possibleType.includes(type);
    }

}

module.exports = UserManagement;