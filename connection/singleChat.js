import { model, Schema } from "mongoose";

let singleModel = new Schema({
    email: { type: String, required: true },
    chatText: { type: String, required: true },
    chatTime: { type: Date, required: true },
    id: { type: String, required: true }
})
let singleChatData = new Schema({
    userPerson1: { type: String, required: true },
    userPerson2: { type: String, required: true },
    chatMessages: [singleModel]
})
export let singlechatsmodel = new model("singleChat", singleChatData)