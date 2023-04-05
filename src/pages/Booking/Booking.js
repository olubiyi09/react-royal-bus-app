import React, { useEffect } from "react";
import styles from "./Booking.module.scss";
import Loader from "../../components/loader/Loader";
import { selectIsLoggedIn } from "../../redux/slice/authSlice";
import { selectBuses, STORE_BUSES } from "../../redux/slice/busSlice";
import useFetchCollection from "../../customHooks/useFetchColletion";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ADD_TO_CART } from "../../redux/slice/cartSlice";

const Booking = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { data, isLoading } = useFetchCollection("buses");
  const myBuses = useSelector(selectBuses);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      STORE_BUSES({
        buses: data,
      })
    );
  }, [dispatch, data]);

  const addToCart = (bus) => {
    dispatch(ADD_TO_CART(bus));
  };

  return (
    <div>
      {isLoading && <Loader />}
      {!isLoggedIn ? (
        <h2 className={styles.else}>Please login</h2>
      ) : (
        <>
          <div
            className={
              data.length === 0 ? `${styles.main}` : `${styles["main-two"]}`
            }
          >
            <div className={` ${styles.sec}`}>
              <h2 style={{ color: "#fff" }}>Available Buses</h2>
              <div
                className={`d-flex justify-content-center flex-wrap ${styles.me}`}
              >
                {myBuses.map((bus, index) => {
                  const {
                    id,
                    name,
                    number,
                    imageUrl,
                    from,
                    to,
                    date,
                    departure,
                    arrival,
                    type,
                    price,
                  } = bus;

                  return (
                    <div className={`card ${styles["card-width"]}`} key={id}>
                      <img
                        className="card-img-top"
                        src={imageUrl}
                        alt="image"
                      />
                      <div className="card-body">
                        <h4
                          className="card-title"
                          style={{ color: "orangered" }}
                        >
                          {" "}
                          {from} to {to}
                        </h4>

                        <p className="card-text">
                          Have a super convenient trip from {from} to {to} for
                          just <b style={{ color: "orangered" }}>${price}</b>.
                        </p>

                        <div className=" d-flex justify-content-between align-items-center">
                          <p>
                            Bus type: <b>{type}</b>
                          </p>

                          <Link
                            to={`/booking-details`}
                            onClick={() => addToCart(bus)}
                          >
                            <button className={`btn ${styles["btn-style"]}`}>
                              Book Trip
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Booking;
