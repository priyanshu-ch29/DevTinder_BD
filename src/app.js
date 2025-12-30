require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const connectDB = require("./config/database");
const { errorHandler } = require('./middleware/auth');
const PORT = process.env.PORT || 5010;
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())
app.use(require("./routes/handler"))
app.use(errorHandler)

connectDB().then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
        console.log("Successfully started server on port: " + PORT);
    });
}).catch((err) => {
    console.log(err);
    process.exit(1);
})

