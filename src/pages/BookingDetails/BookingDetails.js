import React, { useEffect, useState } from "react";
import styles from "./BookingDetails.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems } from "../../redux/slice/cartSlice";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { FaBus, FaMoneyBillAlt } from "react-icons/fa";
import { MdOutlineAirlineSeatReclineExtra } from "react-icons/md";
import { GiBus, GiWeight } from "react-icons/gi";
import SelectSeat from "../SelectSeat/SelectSeat";
import {
  selectSelectedSeats,
  STORE_SELECTED_SEATS,
} from "../../redux/slice/seatSlice";
import Loader from "../../components/loader/Loader";
import useFetchDocument from "../../customHooks/useFetchDocument";

const BookingDetails = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const cartItems = useSelector(selectCartItems);
  const {
    name,
    number,
    price,
    type,
    capacity,
    departure,
    arrival,
    date,
    from,
    to,
  } = cartItems;

  const priceNum = Number(price);

  const sumAmount = priceNum * selectedSeats.length;

  const { document, isLoading } = useFetchDocument("bookedBus", name);

  // Here

  const dispatch = useDispatch();
  const mySeats = useSelector(selectSelectedSeats);

  useEffect(() => {
    dispatch(
      STORE_SELECTED_SEATS({
        seats: document,
      })
    );
  }, [dispatch, document]);

  let availableSeats = "";

  const newSeats = mySeats.map((seatz) => {
    const { selectedSeats } = seatz;
    selectedSeats.map((num) => {
      return num;
    });

    availableSeats = selectedSeats;
  });

  return (
    <>
      {isLoading && <Loader />}
      <div className={` ${styles.mainn}`}>
        <div className={`container  ${styles.wrapper}`}>
          <div className={styles.left}>
            <h4 style={{ color: "#fff" }}>
              {from} to {to}
            </h4>
            <hr />
            <div
              className={`d-flex justify-content-between ${styles["first"]}`}
            >
              <div className="">
                <h6>Bus Depart</h6>
                <p>
                  {date}, {departure}
                </p>
              </div>
              <div className="">
                <h6>Bus Arrive</h6>
                <p>
                  {date}, {arrival}
                </p>
              </div>
            </div>

            <hr />

            <div
              className={`d-flex justify-content-between ${styles["second"]}`}
            >
              <div className="">
                <div className="d-flex align-items-center">
                  <span className={`d-flex align-items-center ${styles.icon}`}>
                    <FaBus size={28} />
                  </span>
                  <span>
                    <h6>Bus Name:</h6>
                    <p> {name}</p>
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <span className={`d-flex align-items-center ${styles.icon}`}>
                    <AiOutlineFieldNumber size={28} />
                  </span>
                  <span>
                    <h6>Bus Number:</h6>
                    <p> {number}</p>
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <span className={`d-flex align-items-center ${styles.icon}`}>
                    <MdOutlineAirlineSeatReclineExtra size={28} />
                  </span>

                  <span>
                    <h6>Bus Type:</h6>
                    <p> {type}</p>
                  </span>
                </div>
              </div>
              <div className="">
                <div className="d-flex align-items-center">
                  <span className={`d-flex align-items-center ${styles.icon}`}>
                    <GiBus size={30} />
                  </span>
                  <span>
                    <h6>Bus Capacity:</h6>
                    <p> {capacity} Passenger</p>
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <span className={`d-flex align-items-center ${styles.icon}`}>
                    <FaMoneyBillAlt size={30} />
                  </span>
                  <span>
                    <h6>Trip Price/Seat:</h6>
                    <p> ${price}</p>
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <span className={`d-flex align-items-center ${styles.icon}`}>
                    <GiWeight size={30} />
                  </span>
                  <span>
                    <h6>Baggage:</h6>
                    <p> 12kg</p>
                  </span>
                </div>
              </div>
            </div>
            <hr />

            <div className={styles.down}>
              <h4>
                Selected seat:{" "}
                <span>
                  {selectedSeats.length === 0 ? "0" : selectedSeats.join(", ")}
                </span>
              </h4>

              <h4>
                Total Price: <span>${priceNum * selectedSeats.length}</span>
              </h4>

              <hr />
            </div>
          </div>

          <div className={styles.right}>
            <SelectSeat
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              cartItems={cartItems}
              name={name}
              mySeats={mySeats}
              availableSeats={availableSeats}
              sumAmount={sumAmount}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingDetails;
