import BookingItem from "./BookingItem";

import styles from "./Bookings.module.css";

export default function Bookings({
  setBusinessClient,
  setDate,
  setStatus,
  setDuration,
  isEditable,
  setIsEditable,
  setSearchParams,
  bookings,
}) {
  return (
    <>
      {bookings.length !== 0 && (
        <div className={styles.gridContainer}>
          {bookings
            .sort((a, b) => {
              return new Date(a.date) - new Date(b.date);
            })
            .sort((a, b) => {
              if (a.status > b.status) return -1;
            })

            .map((booking) => (
              <BookingItem
                key={booking._id}
                setBusinessClient={setBusinessClient}
                setDate={setDate}
                setStatus={setStatus}
                setDuration={setDuration}
                isEditable={isEditable}
                setIsEditable={setIsEditable}
                setSearchParams={setSearchParams}
                booking={booking}
              />
            ))}
        </div>
      )}
    </>
  );
}
