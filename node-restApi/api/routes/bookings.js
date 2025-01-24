const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const BookingsController = require("../controllers/bookings");

// -> Router to get Bookings for userType "client"
router.get(
  "/client/:userId",
  checkAuth,
  BookingsController.bookings_getAll_for_userClient
);

// -> Router to get Bookings for userType "business"
router.get(
  "/business/:businessId",
  checkAuth,
  BookingsController.bookings_getAll_for_userBusiness
);

// -> Router to create new Booking
router.post("/", checkAuth, BookingsController.bookings_create_newBooking);

// -> Router to update Booking
router.patch(
  "/:bookingId",
  checkAuth,
  BookingsController.bookings_update_booking
);

module.exports = router;
