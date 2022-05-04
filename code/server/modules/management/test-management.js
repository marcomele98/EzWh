"use strict"

function TestResult(id, date, result, idTestDescriptor) {
    this.id = id;
    this.date = date;
    this.result = result;
    this.idTestDescriptor = idTestDescriptor;
}

const mapToTestResult = dbRow => new Position(dbRow.id, dbRow.date, dbRow.result, dbRow.idTestDescriptor);

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

// function TestManagement() {


// }

// module.exports = TestManagement;