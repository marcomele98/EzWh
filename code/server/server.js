'use strict';
const express = require('express');

//const DAO = require('./modules/DAO');
const ItemManagement = require('./modules/management/item-management');
//const db = new DAO('database');
const SkuManagement = require ('./modules/management/sku-management');
const PositionManagement = require('./modules/management/position-management');

const position = new PositionManagement();
const item = new ItemManagement;
const sku = new SkuManagement;
// init express
const app = new express();
const port = 3001;

app.use(express.json());

app.post('/api/items', async (req,res) => {
  return item.createNewItem(req, res);
});

app.get('/api/items', async (req,res) => {
  return item.getListItems(req, res);
});

app.get('/api/items/:id', async (req,res) => {
  return item.getItemById(req, res);
});

app.put('/api/items/:id', async (req,res) => {
  return item.modifyItemById(req, res);
});

app.delete('/api/items/:id', async (req,res) => {
  return item.deleteItemById(req, res);
});


/* ------------------SKU ROUTES ----------------- */
app.get('/api/skus', async(req,res) => {
  return sku.getSkuList(req,res);
});

app.get('/api/skus/:id', async(req,res) => {
  return sku.getSkuById(req,res);
})

app.post('/api/sku', async(req,res) => {
  return sku.addSku(req,res);
});


app.put('/api/sku/:id', async(req,res) => {
  return sku.updateSkuInfo(req,res);
});

app.delete('/api/skus/:id', async(req,res) =>{
  return sku.deleteSkuById(req,res);
});

/* ------------------- POSITION ------------------- */
app.get('/api/positions', async(req,res) => {
  return position.getListAllPositionsWH(req, res);
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});




module.exports = app;