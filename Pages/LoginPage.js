import express from 'express';
import { jwtDecode } from 'jwt-decode';
import { userLoginmodel } from '../connection/userLogin.js';
import { jwttoken } from '../additional/JWT.js';
export const LoginServer = express.Router()
LoginServer.post("/", async (req, res) => {
    let data = req.body
    let userData = jwtDecode(data.credential)
    let token = jwttoken({ data: userData.email }, "1d")
    let userFind = await userLoginmodel.findOne({ email: userData.email })
    if (userFind) {
        res.status(200).json({ data: userFind, token: token, msg: "Login Successful" })
    } else {
        let newuser = new userLoginmodel({
            email: userData.email,
            name: userData.name,
            profilepic: userData.picture
        })
        try {
            await newuser.save()
            res.status(200).json({ data: newuser, token: token, msg: "Login Successful" })
        } catch (err) {
            res.status(400).json({ msg: "Something Went Wrong" })
        }
    }
})