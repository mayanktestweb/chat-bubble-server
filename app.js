const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
require('dotenv').config()
const mongoose = require('mongoose')


app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});


const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`server listening on ${port}`);
});