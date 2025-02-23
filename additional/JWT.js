import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
export let jwttoken = (data, duration) => {
    return jwt.sign(data, process.env.JWT_KEY, { expiresIn: duration })
}