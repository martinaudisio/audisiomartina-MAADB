const express = require('express');
const neo4j = require('neo4j-driver');
const app = express();

app.use(express.json());