import express from 'express';
import { chatsmodel } from '../connection/chat.js';
import { userLoginmodel } from '../connection/userLogin.js';
import { singlechatsmodel } from '../connection/singleChat.js';
export let socketServer = express.Router();
socketServer.get("/chatboxmsg", async (req, res) => {
    try {
        let allMessage = await chatsmodel.find();
        res.status(200).json({ data: allMessage })
    } catch {
        res.status(404).json({ msg: "No chat messages found" })
    }
})
socketServer.get("/alluser", async (req, res) => {
    try {
        let allUser = await userLoginmodel.find();
        res.status(200).json({ data: allUser })
    } catch {
        res.status(404).json({ msg: "No User Found" })
    }
})
socketServer.post("/singleChat", async (req, res) => {
    let { data } = req.body
    try {
        let singleData = await singlechatsmodel.findOne({ $or: [{ userPerson1: data.personId1, userPerson2: data.personId2 }, { userPerson1: data.personId2, userPerson2: data.personId1 }] })
        res.status(200).json({ data: singleData.chatMessages })
    } catch {
        res.status(404).json({ msg: "No chat messages found" })
    }
})