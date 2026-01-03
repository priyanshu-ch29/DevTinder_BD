const { userAuth } = require('../middleware/auth')
const ConnectionRequest = require('../models/connectionRequest')
const user = require('../models/user')

const userRouter = require('express').Router()


userRouter.get("/request/recieved", userAuth, async (req, res, next) => {
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
        next(error)
    }
})

userRouter.get("/view/connection", userAuth, async (req, res, next) => {
    try {
        const loggedInUser = req.user
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", "firstName lastName age gender skills bio").populate("toUserId", "firstName lastName age gender skills bio")
        const data = connectionRequest.map(row => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
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
        next(error)
    }
})


// loggedin user -> vo khud ki nahi dekh skta -> ignored vali nahi aani chaiya -> intrested vali nahi aani chaiya -> accepted vali bhi nahi dekhni chaiye  

userRouter.get("/view/feed", userAuth, async (req, res, next) => {
    try {
        const loggedInUser = req.user
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit
        const allUsers = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId status")
        const hideUsersFromFeed = new Set()
        allUsers.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId)
            hideUsersFromFeed.add(req.toUserId)
        })
        const users = await user.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select("firstName lastName age gender bio photo location").skip(skip).limit(limit)
        res.status(200).json({
            success: true,
            users: users
        })
    } catch (error) {
        next(error)
    }
})

module.exports = userRouter