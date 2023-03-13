require("dotenv").config();
const express = require("express");
const cors = require("cors");

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
// const uuid = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to RoyalBus website");
});

const calculateOrderAmount = (amount) => {
  return amount * 100;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items, description, amount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(amount),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    description,
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Node server listening on port ${PORT}`));
