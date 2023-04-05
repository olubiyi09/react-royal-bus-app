import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import styles from "./CheckoutForm.module.scss";
import spinner from "../../assets/spinner.gif";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-toastify";
import {
  CART_AMOUNT,
  selectCartItems,
  selectTotalAmount,
} from "../../redux/slice/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectEmail, selectUserID } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import {
  CART_SUM_AMOUNT,
  selectTotalSumAmount,
} from "../../redux/slice/SumTotalSlice";
import { selectMergedSeats } from "../../redux/slice/mergedSeatSlice";
import {
  selectBookedSeats,
  selectSelectedSeats,
} from "../../redux/slice/seatSlice";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const customerEmail = useSelector(selectEmail);
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectTotalAmount);
  const sumPrice = useSelector(selectTotalSumAmount);
  const mSeats = useSelector(selectMergedSeats);
  const selectedSeatz = useSelector(selectBookedSeats);

  // const description = `RoyalBus payment: email: ${customerEmail}, Amount: ${totalAmount}`;
  const description = `RoyalBus payment: email: ${customerEmail}, Amount: ${sumPrice}`;

  const cItems = useSelector(selectCartItems);
  const cItemsFrom = cItems.from;
  const cItemsTo = cItems.to;
  const cItemsDate = cItems.date;
  const cItemsPrice = cItems.price;
  const cItemsName = cItems.name;
  const cItemsDeparture = cItems.departure;
  const cItemsArrival = cItems.arrival;
  const cItemsNumber = cItems.number;
  const userID = useSelector(selectUserID);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    fetch("https://royal-bus-backend.onrender.com/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cartItems,
        userEmail: customerEmail,
        description,
        // amount: totalAmount,
        amount: sumPrice,
      }),
    });

    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }
  }, [stripe]);

  function makeid(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  const ticketID = makeid(8);

  const bookedSeats = async () => {
    await setDoc(doc(db, "bookedBus", cItemsName), {
      selectedSeats: mSeats,
      createdAt: Timestamp.now().toDate(),
    });
  };

  const saveBooking = () => {
    try {
      const ref = doc(db, "bookings", ticketID);
      const docRef = setDoc(ref, {
        ticketID,
        from: cItemsFrom,
        to: cItemsTo,
        price: sumPrice,
        tripDate: cItemsDate,
        busName: cItemsName,
        busNumber: cItemsNumber,
        arrival: cItemsArrival,
        departure: cItemsDeparture,
        selectedSeatz,
        userID,
        createdAt: Timestamp.now().toDate(),
      });
      bookedSeats();
      toast.success("Bus saved");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const confirmPayment = await stripe
      .confirmPayment({
        elements,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: "http://localhost:3000/success",
        },

        redirect: "if_required",
      })
      .then((result) => {
        // Ok - PaymentIntent //or Bad - error
        if (result.error) {
          setMessage(result.error.message);
          return;
        }
        if (result.paymentIntent) {
          if (result.paymentIntent.status === "succeeded") {
            setIsLoading(false);

            // saveOrder();
            saveBooking();
          }
          navigate("/success");
        }
      });

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <div className={styles.checkout}>
      <div className={`card container ${styles.card}`}>
        <form id="payment-form" onSubmit={handleSubmit}>
          <div>
            <h3>Payment Checkout</h3>
            <LinkAuthenticationElement
              id="link-authentication-element"
              onChange={(e) => setEmail(e.target.value)}
            />
            <PaymentElement
              id={styles["payment-element"]}
              options={paymentElementOptions}
            />
            <button
              disabled={isLoading || !stripe || !elements}
              id="submit"
              className={styles.button}
            >
              <span id="button-text">
                {isLoading ? (
                  <img
                    src={spinner}
                    alt="Loading.."
                    style={{ width: "20px" }}
                  />
                ) : (
                  `Pay $${sumPrice}`
                )}
              </span>
            </button>
            {/* Show any error or success messages */}
            {message && <div id={styles["payment-message"]}>{message}</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
