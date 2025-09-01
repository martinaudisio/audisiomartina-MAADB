# MAADB Project
Web application for querying and analyzing the **LDBC Social Network Benchmark (SNB)** dataset using a **multi-database architecture** with **Neo4j** and **MongoDB**.  

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]() [![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

---

## 📖 Description
The MAADB project aims to simulate **typical social network queries** in a big data context, providing a scalable architecture that integrates:  

- **Neo4j (graph database)** which is efficient for traversing social connections.  
- **MongoDB (document database)** which is ideal for managing posts, messages, and semi-structured content.  

The application supports both **lookup queries** (e.g., list of friends, posts by user) and **analytical queries** (e.g., friends-of-friends, average response time). Some queries are **cross-database**, requiring data integration from both Neo4j and MongoDB.  



---

## Table of Contents
- [Features](#-features)  
- [Architecture](#-architecture)  
- [Prerequisites](#-prerequisites)  
- [Installation](#-installation)  
- [Usage](#-usage)  
- [API Documentation](#-api-documentation)  
- [Repository Structure](#-repository-structure)  
- [Contributing](#-contributing)  
- [License](#-license)  
- [References](#-references)  

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

## 🛠 Installation
Clone the repository:
```bash
git clone https://github.com/martinaudisio/audisiomartina-MAADB.git
cd audisiomartina-MAADB/solution
