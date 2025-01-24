import moment from "moment";

import styles from "./BookingItem.module.css";

export default function BookingItem({
  booking,
  setBusinessClient,
  setDate,
  setStatus,
  setDuration,
  isEditable,
  setIsEditable,
  setSearchParams,
}) {
  function handleUpdateBooking(booking) {
    setSearchParams({ bookingId: booking._id });
    setIsEditable((isEditable) => !isEditable);
    setBusinessClient(booking.businessUser._id);
    setDate(moment(booking.date).format("YYYY-MM-DDTHH:mm:ss"));
    setDuration(booking.duration);
    setStatus(booking.status);
  }

  return (
    <div
      className={
        styles.bookingGridCard +
        " " +
        (booking.status === "cancel" ? styles.canceled : "")
      }
    >
      <p
        className={
          booking.status === "new"
            ? styles.bookingItemStatusNew
            : styles.bookingItemStatusCanceled
        }
      >
        <span>
          Booking:{" "}
          <span
            className={
              styles.bookingItemStatusValue +
              " " +
              (booking.status === "cancel" ? styles.statusValueCanceled : "")
            }
          >
            {booking.status === "cancel" ? "canceled" : "new"}
          </span>
        </span>
        <span>
          {!isEditable && booking.status === "new" && (
            <span onClick={() => handleUpdateBooking(booking)}>🖊</span>
          )}
        </span>
      </p>
      <div className={styles.bookingItemDetails}>
        <p>
          <span>
            <b>Business Client:</b>
          </span>
          <br />
          <span>{booking.businessUser.userName}</span>
        </p>
        <p>
          <span>
            <b>Duration:</b>{" "}
          </span>
          <span>{booking.duration} hours</span>
        </p>
      </div>

      <p className={styles.bookingItemDate}>
        <span>{moment(booking.date).format("MMM Do YYYY, hh:mm a")}</span>
      </p>
    </div>
  );
}
