const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  businessUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: Date, default: Date.now },
  duration: { type: Number, required: true },
  status: { type: String, enum: ["new", "cancel"], default: "new" },
});

module.exports = mongoose.model("Booking", bookingSchema);
