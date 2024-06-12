//IMPORT PACKAGE
const express = require("express");
const userRouter = require("./routes/user");
const otpRouter = require("./routes/otp");
const cors = require("cors");

let app = express();

app.use(express.json());

app.use(express.static("./public"));

//CORS middleware
app.use(cors());

//USING ROUTES
app.use("/api/user", userRouter);
app.use("/api/otp", otpRouter);

module.exports = app;
