import { model, Schema } from "mongoose";

let UserLogin = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    profilepic: { type: String, required: true }
})
export let userLoginmodel = new model("Chat Application Users", UserLogin)