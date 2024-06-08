//IMPORT PACKAGE
const express = require("express");
const userRouter = require("./routes/user");

let app = express();

app.use(express.json());

app.use(express.static("./public"));

//USING ROUTES
app.use("/api/user", userRouter);

module.exports = app;
