# Integration and API Test Report

Date:

Version:

# Contents

- [Dependency graph](#dependency graph)

- [Integration approach](#integration)

- [Tests](#tests)

- [Scenarios](#scenarios)

- [Coverage of scenarios and FR](#scenario-coverage)

- [Coverage of non-functional requirements](#nfr-coverage)



# Dependency graph 

     <report the here the dependency graph of the classes in EzWH, using plantuml or other tool>
     
# Integration approach

    Our team decided to deploy a bottom-up approach. We considered first the lower level classes, those in /modules/database, which 
    iteract with the database through the general DAO class. Thus we moved to API testing since, according to our design choiches, 
    the classes in /modules/managemnt implement all the application logic and the server only calls the methods they expose.
    We decided to follow this approach, avoiding moking modules, mostly for timing issues.
    


#  Integration Tests

   <define below a table for each integration step. For each integration step report the group of classes under test, and the names of
     Jest test cases applied to them, and the mock ups used, if any> Jest test cases should be here code/server/unit_test

## Step 1: Testing DAO
| Classes |Jest test cases |
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

## Step 2: API testing
| Classes | Mocha test cases |
|--|--|
| position-managemnt | adding a new position |
| position-managemnt | adding a new position with wrong data |
| position-managemnt | try to modify a position |
| position-managemnt | try to modify a position with wrong data |
| position-managemnt | try to modify a position id |
| position-managemnt | try to delete a position |
| test-descriptor-management | try adding a new test descriptor |
| test-descriptor-management | try to modify a test descriptor |
| test-descriptor-management | try deleting a test descriptor |
| test-descriptor-management | get a test descriptor |
| test-result-management | get a test result |
| test-result-management | try adding a new test result |
| test-result-management | try adding two test result |
| test-result-management | try to modify a test result |
| test-result-management | try to delete a test result |
| restock-order-management | delete restock order |
| restock-order-management | adding a new restock order |
| restock-order-management | modify restock order state |
| restock-order-management | modify restock order skuitems |
| restock-order-management | modify restock order transport note |
| restock-order-management | getting restock orders list |
| restock-order-management | getting issued restock orders list |
| restock-order-management | getting restock order by id |
| restock-order-management | getting restock order return items |
| return-order-management | delete return order |
| return-order-management | adding a new return order |
| return-order-management | getting return orders list |
| return-order-management | getting return order |
| internal-order-management | delete internal order |
| internal-order-management | adding a new internal order |
| internal-order-management | modify internal order |
| internal-order-management | getting internal orders list |
| internal-order-management | getting issued internal orders list |
| internal-order-management | getting accepted internal orders list |
| internal-order-management | getting internal order by id |
| item-management | delete item |
| item-management | adding a new item |
| item-management | adding a new item wrong |
| item-management | getting item data from the system |
| item-management | getting item list from the system |
| item-management | modify item data from the system |


# API testing - Scenarios


<If needed, define here additional scenarios for the application. Scenarios should be named
 referring the UC in the OfficialRequirements that they detail>

## Scenario UCx.y

| Scenario |  name |
| ------------- |:-------------:| 
|  Precondition     |  |
|  Post condition     |   |
| Step#        | Description  |
|  1     |  ... |  
|  2     |  ... |



# Coverage of Scenarios and FR


<Report in the following table the coverage of  scenarios (from official requirements and from above) vs FR. 
Report also for each of the scenarios the (one or more) API Mocha tests that cover it. >  Mocha test cases should be here code/server/test


| Scenario ID | Functional Requirements covered | Mocha  Test(s) | 
| ----------- | ------------------------------- | ----------- | 
| 2-1 | FR3.3.1 | adding a new position |
|  |  | adding a new position with wrong data |
| 2-3 2-4 | FR3.1.1 - FR3.1.4 | try to modify a position |
|  |  | try to modify a position with wrong data |             
| 2-2 | FR3.1.1 | try to modify a position id |             
| 2-5 | FR3.1.2 | try to delete a position |             
| 12-1 | FR3.2.1 | try adding a new test descriptor |  
| 12-2 | FR3.2.2 | try to modify a test descriptor | 
| 12-3 | FR3.2.3 | try deleting a test descriptor | 
|  | FR5.8.2 | try adding a new test result | 
|  |  | try adding two test result | 
|  |  | try to modify a test result | 
|  |  | try to delete a test result |   
|  | FR5.1 - FR5.3 - FR5.5 - FR5.6 | adding a new restock order |
|  |  | trying to add new restock order with undefined issue date |
|  |  | trying to add new restock order with negative supplier ID |
|  |  | trying to add new product with negative SKUId |
|  |  | trying to add new product with negative price |
|  |  | trying to add new product with negative quantity |
| 5-1 5-3 | FR5.2 | trying to add skuitem to restock order |
|  |  | try to add skuitem with invalid SKUId|   
|  |  | try to add skuitem with rfid too long|  
|  |  | try to add skuitem to invalid restock order id|  
|  |  | try to add skuitem to not existing restock order id|  
|  | FR5.4 | trying to delete a restock order | 
|  |  | try to delete restock order with invalid id|      
| 5-2 | FR5.7 | trying to change state of restock order |
|  |  | try to change restock order state with wrong state|     
|  |  | try to change restock order state with invalid restock order id|     
|  |  | try to change restock order state with not existing restock order id|                  
|  | FR5.8 | adding transport note to restock order | 
|  |  | try to add transport note with invalid delivery date | 
|  |  | try to add transport note to invalid restock order id |
|  |  | try to add transport note to not existing restock order id|
|  | FR5.10 | returning restock order | 
|  |  | try to return invalid restock order id|
|  |  | try to return not existing restock order id|
| 6-1 6-2 | FR5.9 - FR5.11| adding a new return order | 
|  |  | adding new return order with undefined return date |
|  |  | adding new return order with negative restockOrder ID |
|  |  | adding new return order to not existing restockOrder ID |
|  | FR6.1 - FR6.5| adding a new internal order |
|  |  | trying to add new internal order with undefined issue date |
|  |  | trying to add new internal order with negative customer ID |
|  |  | trying to add new product to internal order with negative SKU ID |
| 9-1 9-2 9-3 10-1 | FR6.2 -FR6.3 - FR6.6 - FR6.7 - FR6.8 | trying to modify internal order |
|  |  | trying to modify internal order with invalid new state |
|  |  | trying to modify internal order with invalid SKU ID|
|  |  | trying to modify only state of internal order to not existing internal order ID|
|  |  | trying to modify internal order to not existing internal order ID|
|  | FR6.4 | trying to delete an internal order |
|  |  | try to delete restock order with invalid id|
| 11-1 11-2 | FR7 | adding, modifying and deleting items |
|  |  | try to add item with invalid SKU id|
|  |  | try to add item with invalid item id|
|  |  | try to add item with no SKU found|
|  |  | try to modify item with wrong id|
|  |  | try to modify item with not existing id|
|  |  | try to delete item with invalid id|





# Coverage of Non Functional Requirements

| Non Functional Requirement | Test name |
| ---- | ---- |
| NFR4 | try to modify a position with wrong data |
|  | try to modify a position |
|  | try to modify a position id |
| NFR6 | get a test result |
|  | try adding a new test result |
|  | try to modify a test result |
|  | try to delete a test result |
| NFR9 | try adding a new test result |
|  | try to modify a test result |
|  | try to delete a test result |