'use strict';
const express = require('express');

//const DAO = require('./modules/DAO');
const ItemManagement = require('./modules/management/item-management');
const InternalOrderManagement = require('./modules/management/internalOrder-management');
//const db = new DAO('database');
const SkuManagement = require ('./modules/management/sku-management');

const item = new ItemManagement;
const internalOrder = new InternalOrderManagement;
const sku = new SkuManagement;
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


// internal order api
app.post('/api/internalOrders', async (req,res) => {
  return internalOrder.createNewInternalOrder(req, res);
});

app.get('/api/internalOrders', async (req,res) => {
  return internalOrder.getListInternalOrders(req, res);
});

app.get('/api/internalOrdersIssued', async (req,res) => {
  return internalOrder.getListIssuedInternalOrders(req, res);
});

app.get('/api/internalOrdersAccepted', async (req,res) => {
  return internalOrder.getListAcceptedInternalOrders(req, res);
});

app.get('/api/internalOrders/:id', async (req,res) => {
  return internalOrder.getInternalOrderById(req, res);
});

app.delete('/api/internalOrders/:id', async (req,res) => {
  return internalOrder.deleteInternalOrderById(req, res);
});



// item api
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


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});




module.exports = app;