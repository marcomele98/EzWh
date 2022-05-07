'use strict';
const express = require('express');


const ItemManagement = require('./modules/management/item-management');
const InternalOrderManagement = require('./modules/management/internalOrder-management');

const SkuManagement = require('./modules/management/sku-management');
const PositionManagement = require('./modules/management/position-management');
const SkuItemManagement = require('./modules/management/sku-item-management');

const position = new PositionManagement();

const item = new ItemManagement;
const internalOrder = new InternalOrderManagement;

const sku = new SkuManagement;
const skuItem = new SkuItemManagement;
// init express
const app = new express();
const port = 3001;

app.use(express.json());


//GET /api/test
app.get('/api/hello', (req, res) => {
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});


// internal order api
app.post('/api/internalOrders', async (req, res) => {
  return internalOrder.createNewInternalOrder(req, res);
});

app.get('/api/internalOrders', async (req, res) => {
  return internalOrder.getListInternalOrders(req, res);
});

app.get('/api/internalOrdersIssued', async (req, res) => {
  return internalOrder.getListIssuedInternalOrders(req, res);
});

app.get('/api/internalOrdersAccepted', async (req, res) => {
  return internalOrder.getListAcceptedInternalOrders(req, res);
});

app.get('/api/internalOrders/:id', async (req, res) => {
  return internalOrder.getInternalOrderById(req, res);
});

app.put('/api/internalOrders/:id', async (req, res) => {
  return internalOrder.modifyInternalOrderById(req, res);
});

app.delete('/api/internalOrders/:id', async (req, res) => {
  return internalOrder.deleteInternalOrderById(req, res);
});



// item api
app.post('/api/items', async (req, res) => {
  return item.createNewItem(req, res);
});

app.get('/api/items', async (req, res) => {
  return item.getListItems(req, res);
});

app.get('/api/items/:id', async (req, res) => {
  return item.getItemById(req, res);
});

app.put('/api/items/:id', async (req, res) => {
  return item.modifyItemById(req, res);
});

app.delete('/api/items/:id', async (req, res) => {
  return item.deleteItemById(req, res);
});


/* ------------------     SKU   ------------------- */
app.get('/api/skus', async (req, res) => {
  return sku.getSkuList(req, res);
});

app.get('/api/skus/:id', async (req, res) => {
  return sku.getSkuById(req, res);
})

app.post('/api/sku', async (req, res) => {
  return sku.addSku(req, res);
});


app.put('/api/sku/:id', async (req, res) => {
  return sku.updateSkuInfo(req, res);
});

app.put('/api/sku/:id/position', async (req, res) => {
  return sku.updateSkuPosition(req, res);
})

app.delete('/api/skus/:id', async (req, res) => {
  return sku.deleteSkuById(req, res);
});

/* --------------------SKU ITEM ------------------- */
app.get('/api/skuitems', async (req, res) => {
  return skuItem.getSkuItemList(req, res);
})

app.post('/api/skuitem', async (req, res) => {
  return skuItem.addSkuItem(req, res);
})

app.get('/api/skuitems/:rfid', async (req, res) => {
  return skuItem.getSkuItemByRfid(req, res);
})

app.get('/api/skuitems/sku/:id', async (req, res) => {
  return skuItem.getSkuItemBySkuId(req, res);
})

app.put('/api/skuitems/:rfid', async (req, res) => {
  return skuItem.editInfoSkuItem(req, res);
})

app.delete('/api/skuitems/:rfid', async (req, res) => {
  return skuItem.deleteSkuItemById(req, res);
})
/* ------------------- POSITION ------------------- */
app.get('/api/positions', async (req, res) => {
  return position.getListAllPositionsWH(req, res);
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});




module.exports = app;