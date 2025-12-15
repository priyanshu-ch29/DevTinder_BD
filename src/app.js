require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const PORT = process.env.PORT || 5010;
const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(require("./routes/handler"))

connectDB().then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
        console.log("Successfully started server on port: " + PORT);
    });
}).catch((err) => {
    console.log(err);
    process.exit(1);
})

