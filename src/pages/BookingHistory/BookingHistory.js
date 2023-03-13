import React, { useEffect } from "react";
import styles from "./BookingHistory.module.scss";
import { selectIsLoggedIn, selectUserID } from "../../redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import useFetchCollection from "../../customHooks/useFetchColletion";
import {
  selectBookingHistory,
  STORE_BOOKINGS,
} from "../../redux/slice/bookingsSlice";
import Loader from "../../components/loader/Loader";

const BookingHistory = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { data, isLoading } = useFetchCollection("bookings");
  const bookedHistory = useSelector(selectBookingHistory);
  const userID = useSelector(selectUserID);
  const dispatch = useDispatch();

  // console.log(useSelector(selectBookingHistory));

  useEffect(() => {
    dispatch(STORE_BOOKINGS(data));
  }, [dispatch, data]);

  const filteredBooking = bookedHistory.filter(
    (book) => book.userID === userID
  );

  return (
    <div>
      {!isLoggedIn ? (
        <h2 className={styles.else}>Please login</h2>
      ) : (
        <div className={`container ${styles.wrap}`}>
          <div>
            <h2>Your Booking History</h2>

            <>
              {isLoading && <Loader />}
              <div className={` ${styles.table}`}>
                {filteredBooking.length === 0 ? (
                  <>
                    <hr />
                    <p>No History Found</p>
                  </>
                ) : (
                  <table className="table table-striped table-dark">
                    <thead>
                      <tr>
                        <th scope="col">s/n</th>
                        <th scope="col">Ticket ID</th>
                        <th scope="col">From - To</th>
                        <th scope="col">Trip Date</th>
                        {/* <th scope="col"></th> */}
                        <th scope="col">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBooking.map((booked, index) => {
                        const { id, tripDate, from, to, price } = booked;

                        return (
                          <tr key={id}>
                            <th scope="row">{index + 1}</th>
                            <td>{id}</td>
                            <td>
                              {from}-{to}
                            </td>
                            {/* <td></td> */}
                            <td>{tripDate}</td>
                            <td>${price}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
