"use strict"

function RestockOrder(id, issueDate, state, transportNote, idSupplier, SkuList, SkuItemList, SkuReturnItemList) {
    this.id = id;
    this.issueDate = issueDate;
    this.state = state;
    this.transportNote = transportNote;
    this.idSupplier = idSupplier;
    this.SkuList = SkuList;
    this.SkuItemList = SkuItemList;
    this.SkuReturnItemList = SkuReturnItemList;
}

const mapToRestockOrder = dbRow => new Position(
    dbRow.id, 
    dbRow.issueDate, 
    dbRow.state, 
    dbRow.transportNote, 
    dbRow.idSupplier, 
    dbRow.SkuList, 
    dbRow.SkuItemList, 
    dbRow.SkuReturnItemList);
