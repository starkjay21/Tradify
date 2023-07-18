import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {UserModel} from "../models/Users.js"

const router = express.Router()

router.post("/register", async (req, res) => {
    const { username, password } = req.body
    const user = await UserModel.findOne({username})

    if(user){
        return res.status(400).json({message: "User already exists"})
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new UserModel({username, password: hashedPassword})
    await newUser.save().then(() => console.log("User created"))
    res.status(201).json(newUser.username)

})

router.post("/login", async (req, res) => {
    const { username, password } = req.body
    const user = await UserModel.findOne({username})

    if(!user){
        return res.json({message: "User does not exist"})
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if(!passwordMatch){
        return res.status(401).json({message: "Invalid credentials"})
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
    res.json({token, userID: user._id} )
})

export { router as userRouter }
