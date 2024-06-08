// CONNECT DATABASE
const dotenv = require("dotenv");
dotenv.config(); // load environment variables from .env file
const mongoose = require("mongoose");
const app = require("./app");

console.log(process.env);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    console.log("DB Connection Successful");
  })
  .catch((error) => {
    console.log("Some error has occured");
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server has started...");
});
