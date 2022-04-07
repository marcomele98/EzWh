
 #Requirements Document 

Date: 22 march 2022

Version: 1.2

 
| Version number | Change |
| ----------------- |:-----------|
| 0   | Added Stakeholders, context diagram, FR|
| 1.1 | Fixed Stakeholders, Context Diagram, FR. Added NFR and Deployment Diagram | 
| 1.2 | Add functional requirements, modify context diagram |
| 1.3 | Add use case diagram |


# Contents

- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
	+ [Context Diagram](#context-diagram)
	+ [Interfaces](#interfaces) 
	
- [Contents](#contents)
- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
	- [Context Diagram](#context-diagram)
	- [Interfaces](#interfaces)
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
	- [Functional Requirements](#functional-requirements)
	- [Non Functional Requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
	- [Use case diagram](#use-case-diagram)
		- [Use case 1, UC1](#use-case-1-uc1)
				- [Scenario 1.1](#scenario-11)
				- [Scenario 1.2](#scenario-12)
				- [Scenario 1.x](#scenario-1x)
		- [Use case 2, UC2](#use-case-2-uc2)
		- [Use case x, UCx](#use-case-x-ucx)
- [Glossary](#glossary)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)

# Informal description
Medium companies and retailers need a simple application to manage the relationship with suppliers and the inventory of physical items stocked in a physical warehouse. 
The warehouse is supervised by a manager, who supervises the availability of items. When a certain item is in short supply, the manager issues an order to a supplier. In general the same item can be purchased by many suppliers. The warehouse keeps a list of possible suppliers per item. 

After some time the items ordered to a supplier are received. The items must be quality checked and stored in specific positions in the warehouse. The quality check is performed by specific roles (quality office), who apply specific tests for item (different items are tested differently). Possibly the tests are not made at all, or made randomly on some of the items received. If an item does not pass a quality test it may be rejected and sent back to the supplier. 

Storage of items in the warehouse must take into account the availability of physical space in the warehouse. Further the position of items must be traced to guide later recollection of them.

The warehouse is part of a company. Other organizational units (OU) of the company may ask for items in the warehouse. This is implemented via internal orders, received by the warehouse. Upon reception of an internal order the warehouse must collect the requested item(s), prepare them and deliver them to a pick up area. When the item is collected by the other OU the internal order is completed. 

EZWH (EaSy WareHouse) is a software application to support the management of a warehouse.



# Stakeholders


| Stakeholder name  | Description | 
| ----------------- |:-----------:|
|  Administrator  		| Handles application maintenance (bugs), handles user privileges | 
|  Manager  			| Has information about the inventory and manages stock of products | 
|  Supplier  			| Receive orders and provides items | 
|  Warehouse employee 	| Collects items and store them into the warehouse, handles the inventory, provides the request items to the pick up area |  
| OU employee     		| Issue internal orders, pick them from pick up area | 
| Quality check office 	| Test quality of supplies | 


# Context Diagram and interfaces

## Context Diagram
![contextDiagram](./EzWhContextDiagram.png)

\<actors are a subset of stakeholders>

## Interfaces
\<describe here each interface in the context diagram>

\<GUIs will be described graphically in a separate document>

| Actor | Logical Interface | Physical Interface  |
| ------------- |:-------------:| -----:|
| Administrator 		| GUI 	    | screen, keyboard |
| Manager 				| GUI   	| screen, keyboard |
| Supplier 				| GUI 		| screen, keyboard |
| Warehouse employee 	| GUI 		| screen, keyboard |
| OU employee 			| GUI 		| screen, keyboard |
| Quality check employee| GUI 		| screen, keyboard |


# Stories and personas
\<A Persona is a realistic impersonation of an actor. Define here a few personas and describe in plain text how a persona interacts with the system>

\<Persona is-an-instance-of actor>

\<stories will be formalized later as scenarios in use cases>


# Functional and non functional requirements

## Functional Requirements

\<In the form DO SOMETHING, or VERB NOUN, describe high level capabilities of the system>

\<they match to high level use cases>

| ID        | Description  |
| ------------- |:-------------:| 
| FR1    	| Manage user and rights (user Administaror, Manager, Employee and supplier) |
| FR1.1		| Create a new user or modify an existing user |
| FR1.2    	| Delete a user |
| FR1.3  	| List all users | 
| FR1.4		| Search a user |
| FR1.5		| Manage rights. Authorize access to functions to specific actors according to access right |
| | |
| FR2		| Manage Inventory |
| FR2.1		| Modify quantity available for a product in the warehouse |
| FR2.2		| Modify position for a item |
| FR2.3		| Show available items and their quantities |
| FR2.4		| Search for location of a certain item |
| FR2.5		| Compute available space |
| FR2.6		| Add new item |
| FR2.7		| Delete item |
| FR2.8		| Search item |
| | |
| FR3		| Manage suppliers catalog |
| FR3.1		| Add new item |
| FR3.2		| Modify item |
| FR3.3		| Delete item |
| FR3.4		| List all items |
| FR3.5		| Search for an item |
| | |
| FR4		| Manage order to supplier |
| FR4.1		| Create order to supplier |
| FR4.2		| Add items to order |
| FR4.3		| Select quantity of a certain item |
| FR4.4		| Delete product from order |
| FR4.5		| Delete order |
| FR4.6		| Confirm order |
| FR4.7		| Start a return transaction of faulty items |
| FR4.8		| Send back faulty items of a previous order |
| FR4.9		| Close a return transaction of faulty items |
| FR4.10	| List all orders (active, closed) |
| FR4.11	| Display different supplier and their items |
| FR4.12	| Search item from supplier |
| | |
| FR5		| Manage internal order |
| FR5.1		| Create internal order |
| FR5.2		| Select available item from warehouse inventory |
| FR5.3		| Add product to internal order |
| FR5.4		| Delete product from internal order |
| FR5.5		| Confirm internal order |
| FR5.6		| Delete internal order |
| FR5.7		| Show internal order history |
| | |
|  FR6 		| Send alert for a specific case | 
|  FR6.1 	| Send alert message when the quantity of a certain item is under a certain threshold |
|  FR6.2	| Send alert message when the available physical space is under a certain threshold |
|  FR6.3 	| Send alert message when some items do not pass the quality check |
|  FR6.4	| Send alert message when an order is received |
|  FR6.5 	| Send alert message when item is in the pick up area |
| | |
|  FR7		| Manage quality check |
|  FR7.1	| Select item to check from an order |
|  FR7.2	| Show test to be done for a certain item |
|  FR7.3	| Report test result |
|  FR7.4	| Add test to a product |
| | |
| FR8 		| Authenticate and Authorize |
| FR8.1		| Login |
| FR8.2		| Logout |


## Non Functional Requirements

\<Describe constraints on functional requirements>

| ID        | Type (efficiency, reliability, ..)           | Description  | Refers to |
| ------------- |:-------------:| :-----:| -----:|
|  NFR1     | Usability 	| Application should be used with no specific training for the users | All FR |
|  NFR2     | Performance 	| All functions should complete in < 0.5 sec  | All FR |
|  NFR3     | Privacy		| The data should not be disclosed outside the application | All FR |
|  NFR4 	| Reliability 	| Mean time to failure... | All FR | 


# Use case diagram and use cases


## Use case diagram
![usecaseDiagram](./EzWhUseCaseDiagram.PNG)


\<next describe here each use case in the UCD>
### Use case 3, UC3 Manage supplier's catalog

| Actors Involved        |  Supplier |
| ------------- |:-------------:| 
|  Precondition     | Supplier exists and is logged in |
|  Post condition     | Changes to Database are made and are coherent |
|  Nominal Scenario     | The supplier, via the app, is supposed to be able to manage the list of items they are able to supply to the warehouse  |
|  Variants     | Add item, Modify item, Delete item |
|  Exceptions     | Input Error, Item not found, Item match |

##### Scenario 3-1

| Scenario | Add Item |
| ------------- |:-------------:| 
|  Precondition     | Supplier must be able to provide item |
|  Post condition     | Item correctly stored into the catalog |
| Step#        | Description  |
|  1     | Open Add Item page |  
|  2     | Fill information about Item |
|  3     | Input Item Quantity |
|  4     | Confirm Item Storage |
|  5     | Item is stored into catalog |

##### Scenario 3-2

| Scenario | Item Match |
| ------------- |:-------------:| 
|  Precondition     | At least one Item in catalog |
|  Post condition     | Item not stored into Catalog Database |
| Step#        |   |
|  1     | Open Add Item page |  
|  2     | Fill information about Item |
|  3     | Input Item Quantity |
|  4     | Item Name is match inside system |
|  5     | Error Message displayed about Item match |
|  6     | Item not stored into catalog |

##### Scenario 3-3

| Scenario | Input Error |
| ------------- |:-------------:| 
|  Precondition     | Supplier must be able to provide item |
|  Post condition     | Item not stored into Catalog and user able to re-enter data |
| Step#        | Description  |
|  1     | Open Add Item page |  
|  2     | Fill information about Item |
|  3     | Input Item Quantity |
|  4     | Something wrong with the format of input |
|  5     | Error Message displayed about Input Error |
|  6     | Item not stored into catalog |
|  7     | Input cleared |


##### Scenario 3-4

| Scenario | Modify Item |
| ------------- |:-------------:| 
|  Precondition     | At least one Item in Catalog |
|  Post condition     | Item data modified in Catalog Database |
| Step#        | Description  |
|  1     | Open Catalog View |  
|  2     | User inputs search bar |
|  3     | Query is made to Database |
|  4     | Items respecting requirements shown |
|  5     | Select Item to change |
|  6     | Change Item information and/or quantity |
|  7     | Confirm Changes |
|  8     | Item data is modified in Catalog Database |

##### Scenario 3-5

| Scenario | Delete Item |
| ------------- |:-------------:| 
|  Precondition     | At least one Item in Catalog |
|  Post condition     | Item data deleted from Catalog Database |
| Step#        | Description |
|  1     | Open Catalog View |  
|  2     | User inputs search bar |
|  3     | Query is made to Database |
|  4     | Items respecting requirements shown |
|  5     | Select Item to delete |
|  7     | Confirm Changes |
|  8     | Item data is deleted from Catalog Database |

##### Scenario 3-6

| Scenario | Item not found |
| ------------- |:-------------:| 
|  Precondition     | At least one Item in Catalog |
|  Post condition     | Item not found |
| Step#        | Description |
|  1     | Open Catalog View |  
|  2     | User inputs search bar |
|  3     | Query is made to Database |
|  7     | No item found respecting query |
|  7     | No item shown |
|  7     | Error Message displayed about Search not conclusive |


### Use case 5, UC5 Manage internal order

| Actors Involved        | OU Employee, Warehouse Employee |
| ------------- |:-------------:| 
|  Precondition     | Connection to Database |
|  Post condition     | Order correctly sent to warehouse |
|  Nominal Scenario     | The OU Employee is supposed to be able to see the items available to order and correctly appoint an order  |
|  Variants     | |
| | Make order |
| | Delete order|
| | Show order history |
| | Order confirmed by Warehouse Employee |
|  Exceptions     | Input Error, Current Order not found, Order not found |
 
##### Scenario 5-1

| Scenario | Make order |
| ------------- |:-------------:| 
|  Precondition     | Items are in the warehouse |
|  Post condition     | Alert is sent to warehouse employees notifing about order made |
| Step#        | Description  |
|  1     | Open List of Items|  
|  2     | Select Available Items from Warehouse Inventory |
|  3     | Select the quantities |
|  4     | Confirm Order |
|  5     | Display Recap of Order |
|  6     | Order put into Database |
|  7     | Send Alert to Warehouse notifying about order |

##### Scenario 5-2

| Scenario | Input Error |
| ------------- |:-------------:| 
|  Precondition     | Items are in the warehouse |
|  Post condition     | Order not confirmed and user able to re-enter data |
| Step#        | Description |
|  1     | Open List of Items |  
|  2     | Select Items to Order |
|  3     | Select the quantities |
|  4     | User makes mistake in input format |
|  5     | Alert shown notifying about Input Error |
|  6     | Input cleared |

##### Scenario 5-3

| Scenario | Delete Order |
| ------------- |:-------------:| 
|  Precondition     | There is at least one not confirmed order ongoing |
|  Post condition     | Order is deleted from history |
|      |  Warehouse notified |
| Step#        | Description  |
|  1     | Open List of Orders currently ongoing|  
|  2     | User inputs search bar |
|  3     | Select Orders to Delete |
|  4     | Ask for confirm |
|  5     | Delete Orders from Database |
|  6     | Send Alert to Warehouse about order cancelling |
|  7     | OU Order Alert of Warehouse Employee disappears |

##### Scenario 5-4

| Scenario | Current Order not found |
| ------------- |:-------------:| 
|  Precondition     | There is at least one order ongoing |
|  Post condition     | No order displayed and user able to re-enter data |
| Step#        | Description |
|  1     | Open List of Orders currently ongoing |  
|  2     | User inputs search bar |
|  3     | Query is made to Database |
|  4     | User does not input a Number |
|  5     | Error Message shown notifying about Search not Conclusive |
|  6     | Input cleared |

##### Scenario 5-5

| Scenario | Show Order History |
| ------------- |:-------------:| 
|  Precondition     | There is at least one order made  |
|  Post condition     | No order displayed and user able to re-enter data |
| Step#        | Description  |
|  1     | Open History of Orders |  
|  2     | User inputs search bar |
|  3     | Query is made from Database |
|  4     | List of Orders shown |

##### Scenario 5-6

| Scenario | Order not found |
| ------------- |:-------------:| 
|  Precondition     | Items are in the warehouse |
|  Post condition     | Order not confirmed and user able to re-input data |
| Step#        | Description |
|  1     | Open History of Orders  |  
|  2     | User inputs search bar |
|  3     | Query is made to Database |
|  4     | Order not found given search info |
|  5     | Error Message shown notifying about Search not Conclusive |
|  6     | Input cleared |

##### Scenario 5-7

| Scenario | Order confirmed by Warehouse Employee |
| ------------- |:-------------:| 
|  Precondition     | At least one order is currently ongoing |
|  Post condition     | Order counted as confirmed |
|      | Product.units -= Order.units |
| Step#        | Description  |
|  1     | Warehouse employee opens OU Order Alert |  
|  2     | Warehouse employee confirms order |
|  3     | Database is updated |
|  4     | Order now counts as confirmed |
|  5     | OU Order Alert disappears |

# Glossary

\<use UML class diagram to define important terms, or concepts in the domain of the system, and their relationships> 

\<concepts are used consistently all over the document, ex in use cases, requirements etc>

# System Design
\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram 

\<describe here deployment diagram >

![DeploymentDiagram](./EzWhDeploymentDiagram.png)




