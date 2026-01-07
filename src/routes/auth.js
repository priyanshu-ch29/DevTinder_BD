const authRouter = require("express").Router()
const User = require('../models/user');
const { validateSignUp } = require("../utils/validation");

authRouter.post("/signup", async (req, res, next) => {
    const { firstName, lastName, email, password, age, gender, location, skills, bio, photo } = req.body;
    try {
        validateSignUp(req)
        const user = new User({ firstName, lastName, email, password, age, gender, location, skills, bio, photo });
        await user.hashPassword()
        const savedUser = await user.save();
        const token = await savedUser.issueJWT()
        console.log(token)
        res.cookie("token", token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
        if (user) {
            res.status(200).json({
                success: true,
                message: "User created successfully",
                user: savedUser
            })
        }
    } catch (error) {
        next(error)
    }
})

authRouter.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const isMatch = await user.comparePassword(password);
            if (isMatch) {
                const token = await user.issueJWT()
                res.cookie("token", token, {
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                })
                res.status(200).json({
                    success: true,
                    message: "User logged in successfully",
                    user: user
                })
            } else {
                res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                })
            }
        } else {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
    } catch (error) {
        next(error)
    }
})

authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    }).status(200).json({
        success: true,
        message: "User logged out Successfully!!"
    })
})

module.exports = authRouter

