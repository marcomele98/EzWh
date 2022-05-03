"use strict"

function ReturnOrder(id, date, restockOrderid, SkuReturnItemList) {
    this.id = id;
    this.date = date;
    this.restockOrderid = restockOrderid;
    this.SkuReturnItemList = SkuReturnItemList;
}

const mapToReturnkOrder = dbRow => new Position(
    dbRow.id, 
    dbRow.date, 
    dbRow.restockOrderid, 
    dbRow.SkuReturnItemList);