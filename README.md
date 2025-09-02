# MAADB Project
Web application for querying and analyzing the **LDBC Social Network Benchmark (SNB)** dataset using a **multi-database architecture** with **Neo4j** and **MongoDB**.  

---

## Description
The social network explorer developed for the MADB assignment aims to simulate **typical social network queries** in a big data context, providing a scalable architecture that integrates:  

- **Neo4j (graph database)** which is efficient for traversing social connections.  
- **MongoDB (document database)** which is ideal for managing posts, messages, and semi-structured content.  

The application supports both **lookup queries** (e.g., list of friends, posts by user) and **analytical queries** (e.g., friends-of-friends, average response time). Some queries are **cross-database**, requiring data integration from both Neo4j and MongoDB.  



---

## Table of Contents
- [Features](#features)  
- [Usage Examples](#usage-examples)  
- [Architecture](#architecture)  
- [Prerequisites](#prerequisites)  
- [Installation](#installation)  
- [Usage](#usage)  
- [API Documentation](#api-documentation)  
- [Repository Structure](#repository-structure)  


---

## Features
- **Lookup queries**:  
  - Retrieve direct friends of a user.  
  - Get posts and comments by a user (**cross-database**).  
  - Find users by location and interests.  
  - Retrieve posts from users linked to an organization (**cross-database**).  

- **Analytical queries**:  
  - Calculate friends-of-friends (FoF) and mutual friends.  
  - Compute average response time to posts/comments (**cross-database**).  


---

## Usage Examples

### Lookup Queries

#### Example 1: Retrieve direct friends of a user
**Input**:  
User ID = `14`

**Output**:
```json
  {
    "name": "Ina",
    "surname": "Barbu",
    "id": 32985348837827
  },
  {
    "name": "Daniil",
    "surname": "Ivanov",
    "id": 35184372091452
  },
  {
    "name": "Gheorghe",
    "surname": "Popescu",
    "id": 2199023264850
  }
```

#### Example 2: Retrieve all content posted by a user 
**Input**:  
User ID = `14`

**Output**:
```json
{
    "creator": {
      "firstName": "Hossein",
      "lastName": "Forouhar"
    },
    "content": [
      {
        "_id": "689b19acea0a11f5c0c9b7a8",
        "creationDate": "2012-11-24T20:01:05.220Z",
        "id": 2336462209295,
        "type": "Post",
        "forumTitle": "Album 21 of Hossein Forouhar"
      },
      {
        "_id": "689b19acea0a11f5c0c9b7a7",
        "creationDate": "2012-11-24T20:01:04.220Z",
        "id": 2336462209294,
        "type": "Post",
        "forumTitle": "Album 21 of Hossein Forouhar"
      }
    ]
}
```


#### Example 3: Retrieve people by location and tag
**Input**:  
Location ID = `411`
Tag ID = `1187`

**Output**:
```json
{
    "id": 21990232555526,
    "name": "Baby",
    "surname": "Yang"
}
```

#### Example 4: Retrieve post by creator's organization
**Input**:  
Type = `University`
Organization ID = `3010`

**Output**:
```json
  {
    "id": 381,
    "name": "John",
    "surname": "Sharma",
    "since": 2003,
    "posts": [
      {
        "_id": "689b1a2dea0a11f5c0da77fc",
        "creationDate": "2012-10-05T07:15:51.745Z",
        "id": 2199024421139,
        "locationIP": "14.1.120.230",
        "browserUsed": "Chrome",
        "language": "en",
        "content": "About Francis I of the Two Sicilies; he Two Sicilies frAbout Red Red Wine;  of the song",
        "length": 88,
        "CreatorPersonId": 381,
        "ContainerForumId": 1649268493805,
        "LocationCountryId": 0,
        "forumTitle": "Group for Percy_Bysshe_Shelley in Comrat"
      }
    ]
  }
```

### Analytical Queries

#### Example 1: Retrieve friend of frinds of a user
**Input**:  
User ID = `14`

**Output**:
```json
  {
      "id": 28587302323380,
      "name": "Alexander",
      "surname": "Hleb",
      "mutualFriends": 5
    },
    {
      "id": 35184372090558,
      "name": "John",
      "surname": "Ali",
      "mutualFriends": 5
    },
    {
      "id": 28587302324006,
      "name": "Mohammad",
      "surname": "Forouhar",
      "mutualFriends": 5
    }
```

#### Example 2: Retrieve average response time of a user
**Input**:  
User ID = `14`

**Output**:
```json
{
  "averageReplyTimeSeconds": 5859511.28,
  "formatted": {
    "days": 67,
    "hours": 19,
    "minutes": 38,
    "seconds": 31
  }
}
```


---

## Architecture
The system follows a **modular and distributed architecture**:  

- **React Web Client** , an interactive UI for users to send queries and view results.  
- **API Gateway**, a centralized entry point that routes requests and aggregates cross-database results.  
- **Neo4j Service**, the REST service handling graph queries.  
- **MongoDB Service**, the REST service handling document queries.  

**Request flow**:  
1. User submits query from web client.  
2. API Gateway validates and routes the request.  
3. Services process queries on their respective databases.  
4. Gateway aggregates results and returns them to the client.  

---

## Prerequisites
- **Node.js** (>= 18)  
- **MongoDB** (>= 6.0)  
- **Neo4j** (>= 5.0)  
- **npm** (>= 9.0)  
- [LDBC Datagen Spark](https://github.com/ldbc/ldbc_snb_datagen_spark) to generate dataset.  

---

## Installation
Clone the repository:
```bash
git clone https://github.com/martinaudisio/audisiomartina-MAADB.git
cd audisiomartina-MAADB/solution
```

Install dependencies:
```bash
npm install
```
(Each service has its own package.json and dependencies)

---

## Usage
Start the services:

```bash
node app.js
```


and for the react-client:

```bash
npm start
```

## API Documentation
Interactive API documentation is available via Swagger:

MongoDB API → http://localhost:3001/api-docs/

Neo4j API → http://localhost:3002/api-docs/

Gateway API → http://localhost:3003/api-docs/


## Repository Structure
In the directory solution/ you can find all the code to run. 
