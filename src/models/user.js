const mongoose = require("mongoose");
const validator = require("validator")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// MODEL LEVEL VALIDATION AND MODEL CREATION
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minLength: 3, maxLength: 30 },
    lastName: { type: String, required: false, minLength: 3, maxLength: 30 },
    email: {
        type: String, required: true, lowercase: true, unique: true, trim: true, validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email")
            }
        }
    },
    password: {
        type: String, required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Invalid password")
            }
        }
    },
    age: { type: Number, required: false, min: 18, max: 65 },
    gender: {
        type: String, required: false, lowercase: true, validate(value) {
            if (value && !['male', 'female', 'other'].includes(value)) {
                throw new Error("Invalid gender")
            }
        }
    },
    location: { type: String, required: false },
    photo: {
        type: String, required: false, default: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png", validate(value) {
            if (value && !validator.isURL(value)) {
                throw new Error("Invalid photo URL")
            }
        }
    },
    bio: { type: String, required: false, default: "Hello, My name is xyz" },
    skills: { type: Array, required: false },
}, {
    timestamps: true
})

userSchema.methods.issueJWT = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
    return token;
}

userSchema.methods.hashPassword = async function () {
    const user = this;
    const hashed_password = await bcrypt.hash(user.password, 10);
    user.password = hashed_password;
}

userSchema.methods.comparePassword = async function (inputPassword) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(inputPassword, user.password);
    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);