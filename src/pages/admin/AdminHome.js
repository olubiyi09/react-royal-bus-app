import React, { useEffect } from "react";
import styles from "./AdminHome.module.scss";
import { selectBuses, STORE_BUSES } from "../../redux/slice/busSlice";
import {
  selectBookingHistory,
  STORE_BOOKINGS,
} from "../../redux/slice/bookingsSlice";
import { selectUserList, STORE_USERNAMES } from "../../redux/slice/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaUserPlus, FaBusAlt, FaHistory } from "react-icons/fa";
import useFetchCollection from "../../customHooks/useFetchColletion";

const AdminHome = () => {
  const myBuses = useSelector(selectBuses);
  const bookedHistory = useSelector(selectBookingHistory);
  const allUsers = useSelector(selectUserList);

  const busez = useFetchCollection("buses");
  const bookingz = useFetchCollection("bookings");
  const userz = useFetchCollection("usernames");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      STORE_BUSES({
        buses: busez.data,
      })
    );

    dispatch(STORE_USERNAMES(userz.data));

    dispatch(STORE_BOOKINGS(bookingz.data));
  }, [dispatch, busez, bookingz, userz]);

  return (
    <div className={styles["admin-wrapper"]}>
      <h2>AdminHome</h2>
      <div className="">
        <div className={` ${styles.wrapp}`}>
          <div className={`card ${styles.users}`}>
            <h6>Number of Registered users</h6>
            <FaUserPlus /> <h5>{allUsers.length}</h5>
          </div>
          <div className={`card ${styles.bookings}`}>
            <h6>Total Number of Bookings</h6>
            <FaHistory /> <h5>{bookedHistory.length}</h5>
          </div>
          <div className={`card  ${styles.buses}`}>
            <h6>Number of Available buses</h6>
            <FaBusAlt />
            <h5>{myBuses.length}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
