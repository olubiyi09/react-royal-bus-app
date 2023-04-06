import { Col, Row } from "antd";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../resourses/global.css";
import styles from "./SelectSeat.module.scss";
import { CART_SUM_AMOUNT } from "../../redux/slice/SumTotalSlice";
import { useDispatch } from "react-redux";
import { STORE_MERGED_SEAT } from "../../redux/slice/mergedSeatSlice";
import { STORE_BOOKED_SEATS } from "../../redux/slice/seatSlice";
import { toast } from "react-toastify";

const SelectSeat = ({
  selectedSeats,
  setSelectedSeats,
  cartItems,
  name,
  // mySeats,
  availableSeats,
  sumAmount,
}) => {
  const capacity = Number(cartItems.capacity);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectOrUnselectSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const bookSeat = () => {
    const mergedSeats = [...availableSeats, ...selectedSeats];

    console.log(selectedSeats.length);

    if (selectedSeats.length === 0) {
      toast.error("Please select seat(s)");
    } else {
      dispatch(CART_SUM_AMOUNT(sumAmount));
      dispatch(STORE_MERGED_SEAT(mergedSeats));
      dispatch(STORE_BOOKED_SEATS(selectedSeats));

      navigate("/checkout");
    }
  };

  return (
    <div>
      <div className={`d-flex justify-content-between ${styles.info}`}>
        <p>
          Empty <span className={`empty ${styles.empty}`}></span>
        </p>
        <p>
          Booked <span className={`booked ${styles.booked}`}></span>
        </p>
        <p>
          Selected <span className={`selected ${styles.selected}`}></span>
        </p>
      </div>
      <div className={styles["seat-wrapper"]}>
        <Row gutter={(15, 15)}>
          {Array.from(Array(capacity).keys()).map((seat, index) => {
            let seatClass = "";
            if (selectedSeats.includes(seat + 1)) {
              seatClass = "selected";
            } else if (availableSeats.includes(seat + 1)) {
              seatClass = "booked";
            }

            return (
              <Col span={6} key={index}>
                <div
                  className={` ${styles.seats} ${seatClass}`}
                  onClick={() => selectOrUnselectSeat(seat + 1)}
                >
                  {seat + 1}
                </div>
              </Col>
            );
          })}
        </Row>
      </div>

      <div className={`d-flex justify-content-end ${styles.btn}`}>
        <button onClick={() => bookSeat()}>Book Trip</button>
      </div>
    </div>
  );
};

export default SelectSeat;
