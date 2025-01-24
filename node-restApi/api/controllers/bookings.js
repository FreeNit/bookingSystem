const mongoose = require("mongoose");
const Booking = require("../models/booking");

exports.bookings_getAll_for_userClient = (req, res, next) => {
  const id = req.params.userId;
  Booking.find({ user: id })
    .select("_id user date duration status")
    .populate("businessUser", "_id userName email userType")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        bookings: docs,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.bookings_getAll_for_userBusiness = (req, res, next) => {
  const id = req.params.businessId;
  Booking.find({ businessUser: id })
    .select("_id businessUser date duration status")
    .populate("user", "_id userName email userType")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        bookings: docs,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.bookings_create_newBooking = (req, res, next) => {
  const booking = new Booking({
    _id: new mongoose.Types.ObjectId(),
    user: req.body.user,
    businessUser: req.body.businessUser,
    date: req.body.date,
    duration: req.body.duration,
  });

  booking
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Booking successfully created",
        newBooking: {
          _id: result.id,
          requestor: result.user,
          businessUser: result.businessUser,
          date: result.date,
          duration: result.duration,
          status: result.status,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Booking not created! Please try again.",
        error: err,
      });
    });
};

exports.bookings_update_booking = (req, res, next) => {
  const id = req.params.bookingId;

  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Booking.findOneAndUpdate({ _id: id }, { $set: updateOps }, { new: true })
    .populate("businessUser", "_id userName email userType")
    .then((result) => {
      console.log(result);
      const response = {
        _id: result._id,
        businessUser: result.businessUser,
        date: Date.parse(result.date),
        status: result.status,
        duration: result.duration,
      };
      res.status(200).json({
        message: "Booking successfully updated",
        updatedBooking: response,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: error,
      });
    });
};
