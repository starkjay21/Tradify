import express from "express";
import mongoose from "mongoose";
import { ItemModel } from "../models/Items.js";
import {UserModel} from "../models/Users.js";

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const response = await ItemModel.find({})
        res.json(response)
    } catch (error) {
        res.json({ message: error })
    }
})

router.post("/", async (req, res) => {
    const item = new ItemModel(req.body)

    try {
        const response = await item.save()
        res.json(response)
    } catch (error) {
        res.json({ message: error })
    }
})

router.put("/", async (req, res) => {

    try {
        const item = await ItemModel.findById(req.body.itemID)
        const user = await UserModel.findById(req.body.userID)
        user.savedItems.push(item)
        await user.save()
        res.json({ savedItems: user.savedItems })
    } catch (error) {
        res.json({ message: error })
    }
})

router.get("/savedItems/ids/:userID", async (req, res) => {
    const user = await UserModel.findById(req.params.userID)
    res.json({ savedItemIDs: user?.savedItems })
})

router.get("/savedItems/:userID", async (req, res) => {
  const user = await UserModel.findById(req.params.userID)
  const savedItems = await ItemModel.find({
      _id: { $in: user?.savedItems }
  })
  res.json({ savedItems })
})

export { router as itemRouter }
