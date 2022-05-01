"use strict"

function Position(id, aisle, row, column, maxWeight, maxVolume, occupiedWeight, occupiedVolume) {
    this.id = id;
    this.aisle = aisle;
    this.row = row;
    this.column = column;
    this.maxWeight = maxWeight;
    this.maxVolume = maxVolume;
    this.occupiedWeight = occupiedWeight;
    this.occupiedVolume = occupiedVolume;
}

const mapToPosition = dbRow => new Position(dbRow.id, dbRow.aisle, dbRow.row, dbRow.column,
    dbRow.maxWeight, dbRow.maxVolume, dbRow.occupiedWeight, dbRow.occupiedVolume);