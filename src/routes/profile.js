const profileRouter = require('express').Router()
const { userAuth } = require("../middleware/auth")
const user = require('../models/user')
const { validateEditProfileData } = require('../utils/validation')
const bcrypt = require("bcrypt")
const validator = require("validator")

profileRouter.get("/view", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            user: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "User profile fetching failed",
            error: error.message
        })
    }
})

profileRouter.patch("/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req.body)) {
            throw new Error("Invalid profile data")
        }
        const loggedInUser = req.user
        Object.keys(req.body).forEach((k) => (loggedInUser[k] = req.body[k]))
        await loggedInUser.save()
        res.status(200).json({
            success: true,
            message: "User data updated successfully!!",
            data: loggedInUser
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "User profile edit failed",
            error: error.message
        })
    }
})

profileRouter.patch("/password", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const newPassword = req.body.password
        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: "New password is required"
            })
        }
        const isMatch = await loggedInUser.comparePassword(newPassword)
        if (isMatch) {
            return res.status(400).json({
                success: false,
                message: "New password cannot be the same as old password"
            })
        }
        const isStrongPassword = validator.isStrongPassword(newPassword)
        if (!isStrongPassword) {
            return res.status(400).json({
                success: false,
                message: "Password is too weak. Use uppercase, lowercase, number, and special character",
            });
        }
        const hashPassword = await bcrypt.hash(newPassword, 10)
        loggedInUser.password = hashPassword
        await loggedInUser.save()
        res.status(200).json({
            success: true,
            message: "Password Changed Successfully!!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        })
    }
})


module.exports = profileRouter