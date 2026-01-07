const validator = require("validator");
// API LEVEL VALIDATION
const validateSignUp = (req) => {
    const { firstName, lastName, email, password, age, gender, location, skills, bio, photo } = req.body;
    if (!firstName) {
        throw new Error("First name is required");
    } else if (!validator.isEmail(email)) {
        throw new Error("Invalid email");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Invalid password");
    }
}

const validateEditProfileData = (req) => {
    const allowedFields = ["firstName", "lastName", "email", "age", "gender", "location", "photo", "bio", "skills"]
    const { firstName, lastName, email, password, age, gender, location, skills, bio, photo } = req
    if (photo && !validator.isURL(photo)) {
        throw new Error("Invalid Photo URL!")
    }
    const isAllowedUpdate = Object.keys(req).every(field => allowedFields.includes(field))
    return isAllowedUpdate
}

module.exports = { validateSignUp, validateEditProfileData };