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