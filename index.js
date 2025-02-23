import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { LoginServer } from './Pages/LoginPage.js';
import { dbconnection } from './connection/mongoose.js';
import { socketServer } from './Pages/socket.js';
import { chatsmodel } from './connection/chat.js';
import { v4 } from 'uuid';
import { singlechatsmodel } from './connection/singleChat.js';
import { userLoginmodel } from './connection/userLogin.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
let chatNameSpace = io.of("/chatbox")
chatNameSpace.on('connection', async (socket) => {
    let allMessage = await chatsmodel.find();
    //To get All Chat of Group Message
    socket.emit("update", allMessage)
    //Add Chat of Single Message or add new chat when already present
    socket.on('newmessage', async (msg) => {
        if (msg.chat === "single") {
            let singleData = await singlechatsmodel.findOne({ $or: [{ userPerson1: msg.userPerson1, userPerson2: msg.userPerson2 }, { userPerson1: msg.userPerson2, userPerson2: msg.userPerson1 }] })
            if (singleData) {
                let userEmail = await userLoginmodel.findOne({ _id: msg.userPerson1 })
                singleData.chatMessages.push({ chatText: msg.chatText, id: v4(), chatTime: msg.time, email: userEmail.email })
                await singleData.save()
                let allnewMessage = await singlechatsmodel.find({ $or: [{ userPerson1: msg.userPerson1, userPerson2: msg.userPerson2 }, { userPerson1: msg.userPerson2, userPerson2: msg.userPerson1 }] })
                chatNameSpace.emit("singleupdate", allnewMessage[0].chatMessages)
                console.log("New message : ", msg.chatText)
            } else {
                let userEmail = await userLoginmodel.findOne({ _id: msg.userPerson1 })
                let newSingleData = new singlechatsmodel({ userPerson1: msg.userPerson1, userPerson2: msg.userPerson2, chatMessages: [{ chatText: msg.chatText, id: v4(), chatTime: msg.time, email: userEmail.email }] })
                await newSingleData.save()
                let allnewMessage = await singlechatsmodel.find({ $or: [{ userPerson1: msg.userPerson1, userPerson2: msg.userPerson2 }, { userPerson1: msg.userPerson2, userPerson2: msg.userPerson1 }] })
                chatNameSpace.emit("singleupdate", allnewMessage)
                console.log("New message : ", msg.chatText)
            }
        } else {
            //Add the chat in the Group chat
            let newMessage = new chatsmodel({ chatText: msg.chatText, id: v4(), chatTime: msg.time, email: msg.email })
            await newMessage.save()
            let allnewMessage = await chatsmodel.find();
            chatNameSpace.emit("update", allnewMessage)
            console.log("New message : ", msg.chatText)
        }
    });
    //When user out this will trigger
    socket.on('disconnect', () => {
        console.log("User disconnected")
    });
});
//middleWare to check autenticate or not
let verifyAuthozication = (req, res, next) => {
    let token = req.headers["auth-token"]
    if (!token) {
        res.status(403).json({ msg: "Unauthorized or Invalid Token" });
    } else {
        next()
    }
}
app.use(express.json());
app.use(cors());
app.use("/", LoginServer);
app.use("/", verifyAuthozication, socketServer);
const port = 7777;
await dbconnection();

server.listen(port, () => {
    console.log(`Server running at port : ${port}`);
});
