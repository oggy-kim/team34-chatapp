const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const generateMessage = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('새로운 웹소켓이 열렸습니다.')
    console.log(socket.id)

    socket.on('join', (options, callback) => {
        const {error, user} = addUser({ id: socket.id, ...options })
        console.log(options)

        if(error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('adminMessage', generateMessage('채팅룸에 들어오신 것을 환영합니다.'))
        socket.broadcast.to(user.room).emit('adminMessage', generateMessage(`${user.username}님이 입장하셨습니다.`))
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', generateMessage(message, socket.id, user.username, user.userno))
        callback()
        })
        
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        
        if(user) {
            io.to(user.room).emit('adminMessage', generateMessage(`${user.username}님이 채팅창을 나갔습니다.`))
        }
    })
    })




server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})