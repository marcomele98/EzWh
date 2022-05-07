'use strict';
const express = require('express');


const ItemManagement = require('./modules/management/item-management');
const InternalOrderManagement = require('./modules/management/internalOrder-management');

const SkuManagement = require('./modules/management/sku-management');
const PositionManagement = require('./modules/management/position-management');
const TestDescriptorManagement = require('./modules/management/test-descriptor-management');
const TestResultManagement = require('./modules/management/test-result-management');
const UserManagement = require('./modules/management/user-management')

const position = new PositionManagement;
const testDescriptor = new TestDescriptorManagement;
const testResult = new TestResultManagement;

const item = new ItemManagement;
const internalOrder = new InternalOrderManagement;
const user = new UserManagement;

const sku = new SkuManagement;

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

/* ------------------- USER ------------------- */
app.get('/api/userinfo', (req, res) => {
  return res.status(200).end();
});

app.get('/api/suppliers', (req, res) => {
  return user.getListSuppliers(req, res);
});

app.get('/api/users', (req, res) => {
  return user.getListUsers(req, res);
});

app.post('/api/newUser', async (req, res) => {
  return user.createNewUser(req, res);
});

app.post('/api/managerSession', async (req, res) => {
  return res.status(200).end();
});

app.post('/api/customerSession', async (req, res) => {
  return res.status(200).end();
});

app.post('/api/supplierSession', async (req, res) => {
  return res.status(200).end();
});

app.post('/api/clerkSession', async (req, res) => {
  return res.status(200).end();
});

app.post('/api/qualityEmployeeSessions', async (req, res) => {
  return res.status(200).end();
});

app.post('/api/deliveryEmployeeSessions', async (req, res) => {
  return res.status(200).end();
});

app.post('/api/logout', async (req, res) => {
  return res.status(200).end();
});

app.put('/api/users/:username', async (req, res) => {
  return user.modifyRightsByUsername(req, res);
});

app.delete('/api/users/:username/:type', async (req, res) => {
  return user.deleteUserByUsernameAndType(req, res);
});



/* ------------------- INTERNAL ORDER ------------------- */
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



/* ------------------- ITEM ------------------- */
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



/* ------------------SKU ROUTES ----------------- */
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

app.delete('/api/skus/:id', async (req, res) => {
  return sku.deleteSkuById(req, res);
});



/* ------------------- POSITION ------------------- */
app.get('/api/positions', async (req, res) => {
  return position.getListAllPositionsWH(req, res);
});

app.put('/api/position/:positionID', async (req, res) => {
  return position.modifyPositionAttributes(req, res);
});

app.put('/api/position/:positionID/changeID', async (req, res) => {
  return position.modifyPositionID(req, res);
});

app.post('/api/position', async (req, res) => {
  return position.createNewPosition(req, res);
});

app.delete('/api/position/:positionID', async (req, res) => {
  return position.deletePositionWHByID(req, res);
});



/*------------------- TEST DESCRIPTORS ------------------- */
app.post('/api/testDescriptor', async (req, res) => {
  return testDescriptor.createTestDescriptor(req, res);
});

app.get('/api/testDescriptors', async (req, res) => {
  return testDescriptor.getListTestDescriptors(req, res);
});

app.get('/api/testDescriptors/:id', async (req, res) => {
  return testDescriptor.getTestDescriptorByID(req, res);
});

app.put('/api/testDescriptor/:id', async (req, res) => {
  return testDescriptor.modifyTestDescriptorByID(req, res);
});

app.delete('/api/testDescriptor/:id', async (req, res) => {
  return testDescriptor.deleteTestDescriptorByID(req, res);
});



/*------------------- TEST RESULTS ------------------- */
app.get('/api/skuitems/:rfid/testResults', async (req, res) => {
  return testResult.getTestResultsListByRfid(req, res);
});

app.get('/api/skuitems/:rfid/testResults/:id', async (req, res) => {
  return testResult.getTestResultByIds(req, res);
});

app.post('/api/skuitems/testResult', async (req, res) => {
  return testResult.createTestResultByRfid(req, res);
});

app.put('/api/skuitems/:rfid/testResult/:id', async (req, res) => {
  return testResult.modifyTestResultByIds(req, res);
});

app.delete('/api/skuitems/:rfid/testResult/:id', async (req, res) => {
  return testResult.deleteTestResultByIds(req, res);
});


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});




module.exports = app;