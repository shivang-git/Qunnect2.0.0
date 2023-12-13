const env = require('dotenv').config({ path: __dirname + '/.env' })
const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')

const AuthRoute = require('../routes/AuthRoute')
const Route = require('../routes/Route')

const http = require('http')
const server = http.createServer(app)

const socketio = require('socket.io')
const io = socketio(server)
const{contacts,joinUser,removeUser,getUser}=require('../utils/users')

const mongoose = require('mongoose')
const port = process.env.PORT || 8000


const database_link = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.29gsz.mongodb.net/Qunnect?retryWrites=true&w=majority`

mongoose.connect(database_link)


const staticpath = path.join(__dirname, '../public')

app.use(express.static(staticpath))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// restrict to go back to dashboard after logout
app.use(function(req, res, next) {
    if (!req.user) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
    }
    next();
});




app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));


app.use('/account', AuthRoute)
app.use('/', Route)

app.get('*', (req, res) => {
    res.send('not found')

})

server.listen(port, () => {
    console.log('server listening');
})




io.on('connection', (socket) => {
    
    socket.on('user-joins', (user) => {
     global.friend =joinUser(socket.id,user)
        socket.emit('welcome-msg', "Welcome to Qunnect")
        socket.broadcast.emit('user-joined', user)
        socket.emit('userslist',contacts)
        socket.broadcast.emit('userslist',contacts)
    })

    socket.on('chat-send', (msg) => {
        const user=getUser(socket.id)
        
        socket.broadcast.emit('chat-recieve', { message: msg, user:`${user.username}`  })
    })

    socket.on('typing', user => {
        socket.broadcast.emit('typing', user)
    })



    socket.on('disconnect', () => {
        const user=removeUser(socket.id)
        if(user){
        socket.broadcast.emit('left-chat', `${user.username}`)
        socket.emit('userslist', contacts )
        socket.broadcast.emit('userslist', contacts )

        }
    })
})