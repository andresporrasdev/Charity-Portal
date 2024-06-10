//IMPORT PACKAGE
const express = require("express");
const userRouter = require("./routes/user");
const cors = require("cors");

let app = express();

app.use(express.json());

app.use(express.static("./public"));

//CORS middleware
app.use(cors());

//USING ROUTES
app.use("/api/user", userRouter);

module.exports = app;
