const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const listRouter = require("./routes/listing.route");

app.use(cors());

dotenv.config(); //This will load the variables from your .env file into process.env

app.use(cookieParser());

// Body parser middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log(err));

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listRouter);

app.use((err, req, res, next) => {
  const statuscode = err.statusCode || 500;
  const errMessage = err.message || "Internal server Error";
  return res
    .status(statuscode)
    .json({ errMessage, success: false, statuscode });
});

//App listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
