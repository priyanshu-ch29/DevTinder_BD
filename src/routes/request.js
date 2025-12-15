const requestRouter = require('express').Router()
const { userAuth } = require("../middleware/auth")

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.status(200).json({
            success: true,
            message: "Connection request send to " + user.firstName
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong " + error.message
        })
    }
})


module.exports = requestRouter