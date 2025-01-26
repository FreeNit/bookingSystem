import { useEffect, useState } from "react";
import moment from "moment";
import { useSearchParams } from "react-router-dom";

import BookingForm from "../components/BookingForm";
import Bookings from "../components/Bookings";

export default function Booking({ user }) {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [businessClient, setBusinessClient] = useState();
  const [businessClients, setBusinessClients] = useState([]);
  const [date, setDate] = useState(moment().format("YYYY-MM-DDTHH:mm:ss"));
  const [duration, setDuration] = useState(1);
  const [status, setStatus] = useState("new");
  const [isEditable, setIsEditable] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams("");

  // -> Retrieve bookings and business users
  useEffect(() => {
    const fetchDataAndPopulate = async () => {
      setIsLoading(true);

      // -> Retrieve Bookings
      const bookingURL = `http://localhost:3000/bookings/${user.userType}/${user.userId}`;
      const bookingsRetrieve = await fetch(bookingURL, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      const dataBookings = await bookingsRetrieve.json();
      if (dataBookings.count > 0) {
        setBookings(dataBookings.bookings);
      }

      // -> Retrieve BUSINESS Users
      const businessUserURL = "http://localhost:3000/users/business";
      const businessUsersRetrieve = await fetch(businessUserURL, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      const dataBusinessUsers = await businessUsersRetrieve.json();
      if (dataBusinessUsers.count > 0) {
        const sortedUsers = dataBusinessUsers.businessUsers.sort((a, b) => {
          if (a.userName < b.userName) return -1;
        });
        setBusinessClients(sortedUsers);
      }

      setIsLoading(false);
    };

    fetchDataAndPopulate();
  }, []);

  return (
    <>
      {isLoading ? (
        <h4>Loading...</h4>
      ) : (
        <>
          <BookingForm
            user={user}
            businessClient={businessClient}
            setBusinessClient={setBusinessClient}
            businessClients={businessClients}
            date={date}
            setDate={setDate}
            duration={duration}
            setDuration={setDuration}
            status={status}
            setStatus={setStatus}
            isEditable={isEditable}
            setIsEditable={setIsEditable}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            setBookings={setBookings}
            bookings={bookings}
          />

          {bookings.length === 0 && <h4>You don't have any bookings yet...</h4>}

          <Bookings
            user={user}
            businessClient={businessClient}
            setBusinessClient={setBusinessClient}
            businessClients={businessClients}
            date={date}
            setDate={setDate}
            duration={duration}
            setDuration={setDuration}
            status={status}
            setStatus={setStatus}
            isEditable={isEditable}
            setIsEditable={setIsEditable}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            setBookings={setBookings}
            bookings={bookings}
          />
        </>
      )}
    </>
  );
}
