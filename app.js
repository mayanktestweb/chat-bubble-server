const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
require('dotenv').config()
const mongoose = require('mongoose')
// const { Server } = require("socket.io");
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: '&'
    }
});
const cors = require("cors");

const authRouter = require('./routes/authRouter')
const usersRouter = require('./routes/usersRouter');
const User = require('./models/User');

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


// socket related code
const usersOnline = new Map()


io.on('connection', socket => {
    socket.on('register_user', user => {
        console.log('itss working')
        usersOnline.set(user._id.toString(), socket)

        let usersIds = []
        for (let [key, value] of usersOnline) usersIds.push(key)
        console.log(usersIds)
        io.emit('receive_users', usersIds)
    })

    socket.on('request_users', () => {
        console.log('request users on server')
        let usersIds = []
        for (let [key, value] of usersOnline) usersIds.push(key)
        console.log(usersIds)
        socket.emit('receive_users', usersIds)
    })
})

app.get("/usersOnline", (req, res) => {
    console.log(usersOnline)
    res.send('see console')
})


const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`server listening on ${port}`);
});