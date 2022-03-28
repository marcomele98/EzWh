
 #Requirements Document 

Date: 22 march 2022

Version: 0.0

 
| Version number | Change |
| ----------------- |:-----------|
| | | 


# Contents

- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
	+ [Context Diagram](#context-diagram)
	+ [Interfaces](#interfaces) 
	
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
	+ [Functional Requirements](#functional-requirements)
	+ [Non functional requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
	+ [Use case diagram](#use-case-diagram)
	+ [Use cases](#use-cases)
    	+ [Relevant scenarios](#relevant-scenarios)
- [Glossary](#glossary)
- [System design](#system-design)
- [Deployment diagram](#deployment-diagram)

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
|   Administrator   | Handles application maintenance (bugs), handles user privileges | 
|   Manager  		| Has information about the inventory and manages stock of products | 
|   Supplier  		| Receive orders and provides items | 
|  Warehouse employee | Collects items and store them into the warehouse, handles the inventory, provides the request items to the pick up area |  
|   OU employee     | Issue internal orders, pick them from pick up area | 
| Quality check office | Test quality of supplies | 
|  Payment system   | Handles transaction between users | 
| Database and DBMS system | Stores inventory data | 

# Context Diagram and interfaces

## Context Diagram
![contextDiagram](./EzWh-context-diagram.png)

\<actors are a subset of stakeholders>

## Interfaces
\<describe here each interface in the context diagram>

\<GUIs will be described graphically in a separate document>

| Actor | Logical Interface | Physical Interface  |
| ------------- |:-------------:| -----:|
| Administrator | GUI, CLI  | screen, keyboard  |
| Manager | GUI   | screen, keyboard |
| Supplier | GUI | screen, keyboard |
| Warehouse employee | GUI | screen, keyboard |
| OU employee | GUI | screen, keyboard |
| Quality check office | GUI | screen, keyboard |
| Payment system | API | internet connection |
| Database and DBMS system | API | internet connection |

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
|  FR1     	| Manage invetory  |
|  FR1.1    | Show available items and their quantities |
|  FR1.2    | Update  quantity of items available in the warehouse |
|  FR1.3 	| Show item description |
|  FR1.4 	| Search for specific item in the warehouse  |
|||  
|  FR2   	| Manage orders |
|  FR2.1 	| Make internal orders    |
|  FR2.2	| Make orders to the suppliers |
|  FR2.2.1	| Display different suppliers and their items |
|  FR2.2.2	| Search items from suppliers |	
|  FR2.3 	| Send back faulty items	|
|  FR2.4 	| Display active orders  |
|  FR2.5	| Show order history 	|
|||
|  FR3   	| Manage physical space in the warehouse |
|  FR3.1 	| Update location of a certain item |
|  FR3.2	| Search for location of a certain item |
|  FR3.3 	| Compute available space |
|||
|  FR4 		| Send alert for a specific case | 
|  FR4.1 	| Send alert message when the quantity of a certain item is under a certain threshold |
|  FR4.2	| Send alert message when the available physical space is under a certain threshold |
|  FR4.3 	| Send alert message when some items do not pass the quality check |
|  FR4.4	| Send alert message when an order is received |
|  FR4.5 	| Send alert message when item is in the pick up area |
|||
|  FR5 		| Manage users and user privileges |
|  FR5.1	| Create user |
|  FR5.2	| Manage user privileges |





## Non Functional Requirements

\<Describe constraints on functional requirements>

| ID        | Type (efficiency, reliability, ..)           | Description  | Refers to |
| ------------- |:-------------:| :-----:| -----:|
|  NFR1     |   |  | |
|  NFR2     | |  | |
|  NFR3     | | | |
| NFRx .. | | | | 


# Use case diagram and use cases


## Use case diagram
\<define here UML Use case diagram UCD summarizing all use cases, and their relationships>


\<next describe here each use case in the UCD>
### Use case 1, UC1
| Actors Involved        |  |
| ------------- |:-------------:| 
|  Precondition     | \<Boolean expression, must evaluate to true before the UC can start> |
|  Post condition     | \<Boolean expression, must evaluate to true after UC is finished> |
|  Nominal Scenario     | \<Textual description of actions executed by the UC> |
|  Variants     | \<other normal executions> |
|  Exceptions     | \<exceptions, errors > |

##### Scenario 1.1 

\<describe here scenarios instances of UC1>

\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>

\<a scenario is a more formal description of a story>

\<only relevant scenarios should be described>

| Scenario 1.1 | |
| ------------- |:-------------:| 
|  Precondition     | \<Boolean expression, must evaluate to true before the scenario can start> |
|  Post condition     | \<Boolean expression, must evaluate to true after scenario is finished> |
| Step#        | Description  |
|  1     |  |  
|  2     |  |
|  ...     |  |

##### Scenario 1.2

##### Scenario 1.x

### Use case 2, UC2
..

### Use case x, UCx
..



# Glossary

\<use UML class diagram to define important terms, or concepts in the domain of the system, and their relationships> 

\<concepts are used consistently all over the document, ex in use cases, requirements etc>

# System Design
\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram 

\<describe here deployment diagram >




