const { userAuth } = require('../middleware/auth')
const ConnectionRequest = require('../models/connectionRequest')

const userRouter = require('express').Router()


userRouter.get("/request/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const data = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName age gender skills bio")
        res.status(200).json({
            success: true,
            message: "fetched all the connection request",
            data: data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "something went wrong " + error.message
        })
    }
})

userRouter.get("/view/connection", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", "firstName lastName age gender skills bio").populate("toUserId", "firstName lastName age gender skills bio")

        const data = connectionRequest.map(row => {
            if (row.fromUserId.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            } else {
                return row.fromUserId
            }
        })

        res.status(200).json({
            success: true,
            data: data
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "something went wrong " + error.message
        })
    }
})

module.exports = userRouter