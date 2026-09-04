import express from 'express'
const app = express()
const port = process.env.PORT || 8080
import {Server} from 'socket.io'
import { formatMessage } from './utils/message.js'
import { addUser , getUser , getUsersInRoom, removeUser } from './utils/users.js'

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname)); 
app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
const io = new Server(server, {
    cors:"*"
})

var botName = "ChatCord Bot";

io.on("connection", (socket) => {

    socket.on("joinRoom", ({username, room}) => {
        const user=addUser(socket.id, username, room)
        socket.join(user.room);
         socket.emit("message", formatMessage(botName, "Welcome to the chat"));
        socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} has joined the chat`));
        console.log(socket.id)
        console.log("userConnected");
        io.to(user.room).emit("usersInRoom",{
        room:user.room,
        users:getUsersInRoom(user.room)
})
    }
    

)
    


   
    

    socket.on("chatMessage", (msg) => {
        const user=getUser(socket.id)
        io.to(user.room).emit("message", formatMessage(user.username, msg));
    
   
    })

    socket.on("disconnect", () => {
        const user=removeUser(socket.id)
        console.log("user disconnected");
        if(user){
            io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the chat`));
            io.to(user.room).emit("usersInRoom",{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
       
 
    })

})
    