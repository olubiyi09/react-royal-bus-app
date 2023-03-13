import React from "react";
import { Link } from "react-router-dom";
import styles from "./CheckoutSuccess.module.scss";

const CheckoutSuccess = () => {
  return (
    <div className={styles["main-wrapper"]}>
      <div className={`card ${styles.wrapper}`}>
        <h2>Bus Booked Successfully</h2>

        <p>Enjoy your trip</p>

        <Link to="/history">
          <button>Check Booking Details</button>
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
