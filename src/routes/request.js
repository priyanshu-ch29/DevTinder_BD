const requestRouter = require('express').Router()
const { userAuth } = require("../middleware/auth")
const ConnectionRequest = require('../models/connectionRequest')
const User = require("../models/user")

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        const toUser = await User.findById(toUserId)
        if (!toUser) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        const ALLOWED_STATUSES = ['interested', 'ignored']
        if (!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            })
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (existingConnectionRequest) {
            return res.status(400).json({
                success: false,
                message: "connection request already exits"
            })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save()

        res.status(200).json({
            success: true,
            message: "Connection request send",
            data: data
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong " + error.message
        })
    }
})


module.exports = requestRouter