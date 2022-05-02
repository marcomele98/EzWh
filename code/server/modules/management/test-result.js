"use strict"

function TestResult(id, date, result, idTestDescriptor) {
    this.id = id;
    this.date = date;
    this.result = result;
    this.idTestDescriptor = idTestDescriptor;
}

const mapToTestResult = dbRow => new Position(dbRow.id, dbRow.date, dbRow.result, dbRow.idTestDescriptor);
