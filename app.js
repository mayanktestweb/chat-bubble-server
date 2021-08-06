const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
require('dotenv').config()
const mongoose = require('mongoose')
const { Server } = require("socket.io");
const io = new Server(server);
const cors = require("cors");

const authRouter = require('./routes/authRouter')
const usersRouter = require('./routes/usersRouter')

mongoose.connect(`${process.env.DB_URL}`)

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const db = mongoose.connection
db.on('error', () => console.log('failed to connect to database'))
db.once('open', () => console.log('database connected'))

app.use(express.static('public'))
app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

app.use("/api/auth", authRouter)
app.use("/api/users", usersRouter)




const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`server listening on ${port}`);
});