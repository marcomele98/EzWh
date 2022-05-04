'use strict';
const express = require('express');

//const DAO = require('./modules/DAO');
const ItemManagement = require('./modules/management/item-management');
//const db = new DAO('database');

const item = new ItemManagement;

// init express
const app = new express();
const port = 3001;

app.use(express.json());


//GET /api/test
app.get('/api/hello', (req,res)=>{
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});

app.post('/api/items', async (req,res) => {
  return item.createNewItem(req, res);
});

app.get('/api/items', async (req,res) => {
  return item.getListItems(req, res);
});

app.get('/api/items/:id', async (req,res) => {
  return item.getItemById(req, res);
});


app.delete('/api/items/:id', async (req,res) => {
  return item.deleteItemById(req, res);
});



// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});




module.exports = app;