import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { selectEmail } from "../../redux/slice/authSlice";
import {
  CART_AMOUNT,
  selectCartItems,
  selectTotalAmount,
} from "../../redux/slice/cartSlice";
import { toast } from "react-toastify";
import CheckoutForm from "../../components/CheckoutForm/CheckoutForm";
import Loader from "../../components/loader/Loader";

// import styles from "./CheckoutDetails.module.scss";

const stripePromise = loadStripe(process.env.REACT_APP_PK);

const CheckoutDetails = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("Initializing Checkout");
  const customerEmail = useSelector(selectEmail);
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectTotalAmount);

  const dispatch = useDispatch();

  const description = `RoyalBus payment: email: ${customerEmail}, Amount: ${totalAmount}`;

  useEffect(() => {
    dispatch(CART_AMOUNT());
  }, [cartItems]);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("https://royal-bus-api.onrender.com/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cartItems,
        userEmail: customerEmail,
        description,
        amount: totalAmount,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((json) => Promise.reject(json));
        }
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        setMessage("Failed to Initialize checkout");
        setIsLoading(false);
        toast.error("Something went wrong");
      });
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };
  return (
    <>
      <div>
        <div className="container">{!clientSecret && <Loader />}</div>
      </div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
};

export default CheckoutDetails;
