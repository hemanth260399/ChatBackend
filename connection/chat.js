import { model, Schema } from "mongoose";

let ChatData = new Schema({
    email: { type: String, required: true },
    chatText: { type: String, required: true },
    chatTime: { type: Date, required: true },
    id: { type: String, required: true }
})
export let chatsmodel = new model("Chats", ChatData)