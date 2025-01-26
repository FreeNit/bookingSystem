import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";

import styles from "./Form.module.css";

import Button from "./Button";

const schema = z.object({
  businessClient: z.string().min(5),
  bookingDate: z.string().min(10),
  status: z.string().min(3),
  duration: z.coerce
    .number()
    .positive()
    .lte(5, { message: "Booking not longer than 5 hours" }),
});

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
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (bookingData) => {
    try {
      if (!isEditable) {
        const newBooking = {
          user: user.userId,
          businessUser: bookingData.businessClient,
          duration: bookingData.duration,
          date: new Date(bookingData.bookingDate).toISOString(),
        };

        const createBookingURL = "http://localhost:3000/bookings";
        const responseBooking = await fetch(createBookingURL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBooking),
        });

        if (responseBooking.status === 201 && responseBooking.ok) {
          const response = await responseBooking.json();
          setBookings((bookings) => [...bookings, response.newBooking]);
        }
      }
      // -> Update Booking
      if (isEditable) {
        const booking = {
          user: user.userId,
          businessUser: bookingData.businessClient,
          duration: bookingData.duration,
          date: new Date(bookingData.bookingDate).toISOString(),
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
      setBusinessClient();
      setDate(moment().format("YYYY-MM-DDTHH:mm:ss"));
      setDuration(1);
    } catch (error) {
      setError("root", {
        message: error.message,
      });
    }
  };

  // -> Cancel modification
  function handleCancel() {
    setSearchParams("");
    setIsEditable(false);
    setBusinessClient();
    setDate(moment().format("YYYY-MM-DDTHH:mm:ss"));
    setDuration(1);
  }

  return (
    <div className={styles.formWrapper}>
      <p className={styles.bookingHeader}>
        {isEditable ? "Update Current Booking" : "Create New Booking"}
      </p>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.row}>
          <label htmlFor="businessUser">Business Client</label>
          <select
            {...register("businessClient")}
            name="businessUser"
            id="businessUser"
            value={businessClient}
            onChange={(e) => setBusinessClient(e.target.value)}
          >
            {businessClients.map((businessUser) => (
              <option key={businessUser._id} value={businessUser._id}>
                {businessUser.userName}
              </option>
            ))}
          </select>
          {errors.businessClient && (
            <div className={styles.error}>{errors.businessClient.message}</div>
          )}
        </div>

        <div className={styles.row}>
          <label htmlFor="date">Booking Date</label>
          <input
            {...register("bookingDate")}
            className="datepicker"
            type="datetime-local"
            name="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {errors.bookingDate && (
            <div className={styles.error}>{errors.bookingDate.message}</div>
          )}
        </div>

        <div className={styles.row}>
          <label htmlFor="duration">Duration (in hours)</label>
          <input
            {...register("duration")}
            type="number"
            name="duration"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.valueAsNumber)}
          />
          {errors.duration && (
            <div className={styles.error}>{errors.duration.message}</div>
          )}
        </div>

        <div className={styles.row}>
          <label htmlFor="bookingStatus">Booking Status</label>
          <select
            {...register("status")}
            name="bookingStatus"
            id="bookingStatus"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={!isEditable}
          >
            <option value="new">New</option>
            <option value="cancel">Cancel</option>
          </select>
          {errors.status && (
            <div className={styles.error}>{errors.status.message}</div>
          )}
        </div>

        {isEditable && (
          <>
            <div className={styles.buttonsWrapper}>
              <Button
                type="submit"
                text={isSubmitting ? "Loading..." : "Save"}
                disabled={isSubmitting}
              />
              <Button type="button" text="cancel" handleClick={handleCancel} />
            </div>
          </>
        )}

        {!isEditable && (
          <div className={styles.buttons}>
            <Button
              type="submit"
              text={isSubmitting ? "Loading..." : "Create new"}
              disabled={isSubmitting}
            />
          </div>
        )}

        {errors.root && (
          <div className={styles.error}>{errors.root.message}</div>
        )}
      </form>
    </div>
  );
}
