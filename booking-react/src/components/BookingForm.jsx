import styles from "./Form.module.css";

import Button from "./Button";

export default function BookingForm({
  user,
  businessClient,
  setBusinessClient,
  businessClients,
  date,
  setDate,
  duration,
  status,
  setStatus,
  setDuration,
  isEditable,
  setIsEditable,
  searchParams,
  setSearchParams,
  setBookings,
  bookings,
}) {
  // -> Create | Update booking
  function handleSubmitForm(e, operationType = "new") {
    e.preventDefault();

    if (operationType === "new") {
      const newBooking = {
        user: user.userId,
        businessUser: businessClient,
        duration: duration,
        date: new Date(date).toISOString(),
      };

      const response = fetch("http://localhost:3000/bookings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBooking),
      });

      response
        .then((resp) => {
          if (resp.status === 201 && resp.ok) {
            // -> Retrieve Bookings
            const bookingURL = `http://localhost:3000/bookings/${user.userType}/${user.userId}`;
            const bookingsRetrieve = fetch(bookingURL, {
              headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json",
              },
            });
            bookingsRetrieve
              .then((bookingResponse) => bookingResponse.json())
              .then((dataBookings) => {
                if (dataBookings.count > 0) {
                  setBookings(dataBookings.bookings);
                }
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    }

    if (operationType === "update") {
      const booking = {
        user: user.userId,
        businessUser: businessClient,
        duration: duration,
        date: new Date(date).toISOString(),
        status: status,
      };

      const updatedBooking = [];
      for (const property in booking) {
        updatedBooking.push({ propName: property, value: booking[property] });
      }

      const bookingId = searchParams.get("bookingId");
      const bookingUpdateURL = `http://localhost:3000/bookings/${bookingId}`;
      const response = fetch(bookingUpdateURL, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBooking),
      });
      response
        .then((res) => res.json())
        .then((data) => {
          const bookingIndexToReplace = bookings.findIndex(
            (booking) => booking._id === data.updatedBooking._id
          );
          const newBookings = bookings.toSpliced(
            bookingIndexToReplace,
            1,
            data.updatedBooking
          );
          setBookings(newBookings);
          setIsEditable(false);
          setSearchParams("");
        })
        .catch((err) => console.log(err));
    }

    setBusinessClient("");
    setDate("");
    setDuration("");
  }

  // -> Cancel modification
  function handleCancel() {
    setSearchParams("");
    setIsEditable(false);
    setBusinessClient("");
    setDate("");
    setDuration("");
  }

  return (
    <div className={styles.formWrapper}>
      <p className={styles.bookingHeader}>
        {isEditable ? "Update Current Booking" : "Create New Booking"}
      </p>

      <form className={styles.form}>
        <div className={styles.row}>
          <label htmlFor="businessUser">Business Client</label>
          <select
            name="businessUser"
            id="businessUser"
            required
            value={businessClient}
            onChange={(e) => setBusinessClient(e.target.value)}
          >
            {businessClients.map((businessUser) => (
              <option key={businessUser._id} value={businessUser._id}>
                {businessUser.userName}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.row}>
          <label htmlFor="date">Booking Date</label>
          <input
            className="datepicker"
            type="datetime-local"
            name="date"
            required
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="duration">Duration (in hours)</label>
          <input
            type="number"
            name="duration"
            required
            min="1"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        {isEditable && (
          <div className={styles.row}>
            <label htmlFor="bookingStatus">Booking Status</label>
            <select
              name="bookingStatus"
              id="bookingStatus"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="new">New</option>
              <option value="cancel">Cancel</option>
            </select>
          </div>
        )}

        {isEditable && (
          <>
            <div className={styles.buttonsWrapper}>
              <Button
                type="submit"
                text="save"
                handleClick={(e) => handleSubmitForm(e, "update")}
              />
              <Button type="button" text="cancel" handleClick={handleCancel} />
            </div>
          </>
        )}

        {!isEditable && (
          <div className={styles.buttons}>
            <Button
              type="submit"
              text="Create new"
              handleClick={handleSubmitForm}
            />
          </div>
        )}
      </form>
    </div>
  );
}
