"use strict"

function TestDescriptor(id, name, procedure, idSku) {
    this.id = id;
    this.name = name;
    this.procedure = procedure;
    this.idSku = idSku;

    this.getSKUId = () => {
        return this.idSku;
    }
}

const mapToTestDescriptor = dbRow => new Position(dbRow.id, dbRow.name, dbRow.procedure, dbRow.idSku);