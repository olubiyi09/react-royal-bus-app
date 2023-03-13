import React, { useEffect } from "react";
import styles from "./BookNow.module.scss";
import { selectIsLoggedIn } from "../../redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectBuses, STORE_BUSES } from "../../redux/slice/busSlice";
import useFetchCollection from "../../customHooks/useFetchColletion";
import Loader from "../../components/loader/Loader";
import { Link, useParams } from "react-router-dom";
import { ADD_TO_CART } from "../../redux/slice/cartSlice";

const BookNow = () => {
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
        <div
          className={
            myBuses.length === 0 ? `${styles.main}` : `${styles["main-two"]}`
          }
        >
          <div className={styles.section}>
            {myBuses.map((bus, index) => {
              const {
                id,
                name,
                number,
                from,
                to,
                date,
                departure,
                arrival,
                price,
              } = bus;

              return (
                <div className={`card ${styles.wrapper}`} key={id}>
                  <div className={styles.details}>
                    <div className={styles["sec-one"]}>
                      <div>
                        <p>Name</p>
                        <h6>{name}</h6>
                      </div>
                      <div>
                        <p>No</p>
                        <h6>{number}</h6>
                      </div>
                    </div>
                    <div className={styles["sec-two"]}>
                      <div className={styles["div-flex"]}>
                        <p>From</p>
                        <h6>{from}</h6>
                      </div>
                      <div>
                        <p>To</p>
                        <h6>{to}</h6>
                      </div>
                    </div>
                    <div className={styles["sec-three"]}>
                      <div>
                        <p>Depart</p>
                        <h6>{departure}</h6>
                      </div>
                      <div>
                        <p>Arrive</p>
                        <h6>{arrival}</h6>
                      </div>
                    </div>
                    <div className={styles["sec-four"]}>
                      <div>
                        <p>Trip-Date</p>
                        <h6>{date}</h6>
                      </div>
                      <div>
                        <p>Price</p>
                        <h6>${price}</h6>
                      </div>
                    </div>
                  </div>

                  <div className={`d-flex justify-content-end ${styles.btn}`}>
                    {/* <Link to={`/checkout/${id}`} onClick={() => addToCart(bus)}> */}
                    <Link to={`/checkout`} onClick={() => addToCart(bus)}>
                      <button>Book Trip</button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookNow;
