const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
            throw new Error("Token invalid !!!")
        }
        const decodedId = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decodedId._id)
        if (!user) {
            throw new Error("User not found!!")
        }
        req.user = user
        next()
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorized: " + error.message
        })
    }
}


const errorHandler = (err, req, res, next) => {
    console.error(err);
    const statusCode = err.statusCode || 500;
    console.log(err.message)
    res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong",
    });
};



module.exports = {
    userAuth,
    errorHandler
}