# Unit Testing Report

Date:

Version:

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)




- [White Box Unit Tests](#white-box-unit-tests)


# Black Box Unit Tests

    <Define here criteria, predicates and the combination of predicates for each function of each class.
    Define test cases to cover all equivalence classes and boundary conditions.
    In the table, report the description of the black box test case and (traceability) the correspondence with the Jest test case writing the 
    class and method name that contains the test case>
    <Jest tests  must be in code/server/unit_test  >

    Since the units under test are dummy, i.e. all the logic is in the management classes, tests done on these classes are really simple.

### **Class *positionDAO* - method *createNewPositionWH***

**Criteria for method *createNewPositionWH*:**
	

 - ID already existing or not in DB

**Predicates for method *ncreateNewPositionWH*:**

| Criteria | Predicate |
| -------- | --------- |
| ID | ID already exists |
|| ID does not exists yet |

**Combination of predicates**:


| ID | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| not exists | V | try to insert a new position | create new position |
| exists | I | try to insert a new position and than a new one with same id | create new position |

### **Class *test-descriptorDAO* - method *createTestDescriptor***

**Criteria for method *createTestDescriptor*:**
	

 - ID already existing or not in DB

**Predicates for method *createTestDescriptor*:**

| Criteria | Predicate |
| -------- | --------- |
| ID | ID already exists |
|| ID does not exists yet |

**Combination of predicates**:


| ID | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| not exists | V | try to insert a new test descriptor | create new test descriptor |
| exists | I | try to insert a new test descriptor and than a new one with same id | create new test descriptor |

### **Class *test-resultDAO* - method *createTestResultByRfid***

**Criteria for method *createTestResultByRfid*:**
	

 - ID already existing or not in DB

**Predicates for method *createTestResultByRfid*:**

| Criteria | Predicate |
| -------- | --------- |
| ID | ID already exists |
|| ID does not exists yet |

**Combination of predicates**:


| ID | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| not exists | V | try to insert a new test result | create new test descriptor |
| exists | I | try to insert a new test result and than a new one with same id | create new test result |

### **Class *restockOrderDAO* - method *storeRestockOrder***

**Criteria for method *createTestDescriptor*:**
	

 - ID already existing or not in DB

**Predicates for method *createTestDescriptor*:**

| Criteria | Predicate |
| -------- | --------- |
| ID | ID already exists |
|| ID does not exists yet |

**Combination of predicates**:


| ID | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| not exists | V | try to insert a new restock order | create new restock order |
| exists | I | try to insert a new restock order and than a new one with same id | create new restock order |

### **Class *itemDAO* - method *storeItem***

**Criteria for method *storeItem*:**
	

 - ID already existing or not in DB

**Predicates for method *createTestDescriptor*:**

| Criteria | Predicate |
| -------- | --------- |
| ID | ID already exists |
|| ID does not exists yet |

**Combination of predicates**:


| ID | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| not exists | V | try to insert a new item | create new item |
| exists | I | try to insert a new item and than a new one with same id and supplierId | create new item - duplicate |


# White Box Unit Tests

### Test cases definition

| Unit name | Jest test case |
|--|--|
|positionDAO|empty db|
|positionDAO|create new position|
|positionDAO|modify position id|
|test-descriptorDAO|empty db|
|test-descriptorDAO|create new test descriptor|
|test-descriptorDAO|Modify a test descriptor|
|test-resultDAO|empty db|
|test-resultDAO|create new test result|
|test-resultDAO|modify a test result|
|restockOrderDAO|empty db|
|restockOrderDAO|create new restock order|
|restockOrderDAO|modify restock order|
|returnOrderDAO|empty db|
|returnOrderDAO|create new return order|
|returnOrderDAO|modify return order|
| itemDAO | create new item |
| itemDAO | create new item - duplicate |
| itemDAO | delete item |
| itemDAO | modify item |
| itemDAO | get sku by supp |
| internalOrderDAO | get internal order issued |
| internalOrderDAO | get internal order accepted |
| internalOrderDAO | modify internal order accepted |
| internalOrderDAO | delete internal order |
| internalOrderDAO | create new Internal Order |

### Code coverage report

Coverage for positionDAO :
![positionDAO_coverage](./coverageScreens/positionDAO.test.png)

Coverage for test-descriptorDAO :
![test-descriptorDAO_coverage](./coverageScreens/test-descriptorDAO.test.png)

Coverage for test-resultDAO :
![test-resultDAO_coverage](./coverageScreens/test-resultDAO.test.png)

Coverage for restockOrderDAO :
![restockOrderDAO_coverage](./coverageScreens/restockOrderDAO.test.PNG)

Coverage for returnOrderDAO :
![returnOrderDAO_coverage](./coverageScreens/returnOrderDAO.test.PNG)

Coverage for itemDAO :
![itemDAO_coverage](./coverageScreens/itemDAO.test.PNG)

Coverage for returnOrderDAO :
![internalOrderDAO_coverage](./coverageScreens/internalOrderDAO.png)


### Loop coverage analysis

    <Identify significant loops in the units and reports the test cases
    developed to cover zero, one or multiple iterations >

|Unit name | Loop rows | Number of iterations | Jest test case |
|---|---|---|---|
|||||
|||||
||||||



