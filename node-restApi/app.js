const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();

const userRoutes = require("./api/routes/users");
const bookingRoutes = require("./api/routes/bookings");

// -> Connection to MongoDB
mongoose.connect(
  "mongodb+srv://BookingProject:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0.i3pce.mongodb.net/Booking?retryWrites=true&w=majority&appName=Cluster0"
);

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// -> Routes which should handle requests
app.use("/users", userRoutes);
app.use("/bookings", bookingRoutes);

app.use((erq, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// -> Route for Error handling
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      status: error.status,
      message: error.message,
    },
  });
});

module.exports = app;
