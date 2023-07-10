import React, { useEffect, useState } from "react";
import styles from "./Bookings.module.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { ADD_TO_CART, selectCartItems } from "../../redux/slice/cartSlice";
import { Link } from "react-router-dom";

const cities = [
  "Paris",
  "Texas",
  "Dublin",
  "Lyon",
  "Manchester",
  "Maryland",
  "Bolton",
  "London",
];

const busTypes = ["Select Bus Type ---", "AC", "NO AC"];

const Bookings = () => {
  const [firstCity, setFirstCity] = useState("");
  const [secondCity, setSecondCity] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");

  // const cartItems = useSelector(selectCartItems);

  const dispatch = useDispatch();

  const handleChange = (event) => {
    setFirstCity(event.target.value);
  };
  const handleChangeTwo = (event) => {
    setSecondCity(event.target.value);
  };
  const handleBusType = (event) => {
    setType(event.target.value);
  };

  const handleDateChange = (event) => {
    const { value } = event.target;
    setSelectedDate(value);
  };

  const toOptions = cities
    .filter((city) => city !== firstCity)
    .map((city) => (
      <option key={city} value={city}>
        {city}
      </option>
    ));

  const fromOptions = cities.map((city) => (
    <option key={city} value={city}>
      {city}
    </option>
  ));

  let tripFare;

  const tripPrices = {
    Paris: 50,
    Texas: 70,
    Dublin: 80,
    Lyon: 65,
    Manchester: 76,
    Maryland: 55,
    Bolton: 50,
    London: 85,
  };
  let firstFare = tripPrices[firstCity] || "Price not available";
  let secondFare = tripPrices[secondCity] || "Price not available";
  tripFare = firstFare + secondFare;

  const truncatedFirstCity = firstCity.substring(0, 3).toUpperCase();
  const truncatedSecondCity = secondCity.substring(0, 3).toUpperCase();

  let name = truncatedFirstCity + "-" + truncatedSecondCity;

  const number = Math.floor(Math.random() * 10000);
  const capacity = 35;
  const departure = "07: 00";
  const arrival = "12: 00";

  useEffect(() => {
    setPrice(tripFare);
  }, [firstCity, secondCity]);

  const tripDetails = {
    firstCity,
    secondCity,
    selectedDate,
    type,
    price,
    name,
    number,
    capacity,
    departure,
    arrival,
  };

  const bookTrip = (tripDetails) => {
    if (firstCity === "") {
      toast.success("Please select a city");
    } else if (secondCity === "") {
      toast.success("Please select a city");
    } else if (type === "") {
      toast.success("Please select bus type");
    } else if (selectedDate === "") {
      toast.success("Please select date");
    } else {
      dispatch(ADD_TO_CART(tripDetails));
    }
  };

  return (
    <>
      <div className={styles["bookings-wrapper"]}>
        <div className={`mt-5 ${styles["sep"]}>`}>
          <h1>BOOK YOUR BUS TICKET</h1>
          <p className={styles["info-p"]}>
            Choose Your Destinations And Dates To Reserve A Ticket
          </p>

          <div className={styles.bookbtn}>
            <button>Book Now</button>
          </div>

          <div className={styles["wrap-all"]}>
            <div className={` ${styles["booking-section"]}`}>
              <div className={styles["sec-cont"]}>
                <div>
                  <label htmlFor="from">From</label>
                  <select
                    id="from"
                    className={styles["custom-select"]}
                    value={firstCity}
                    onChange={handleChange}
                  >
                    <option value="">Select a city ---</option>
                    {fromOptions}
                  </select>
                </div>

                <div>
                  <label htmlFor="to">To</label>
                  <select
                    id="to"
                    className={styles["custom-select"]}
                    value={secondCity}
                    onChange={handleChangeTwo}
                  >
                    <option value="">Select a city ---</option>
                    {toOptions}
                  </select>
                </div>
              </div>

              <div className={styles["sec-cont"]}>
                <div>
                  <label htmlFor="bus">Bus Type</label>
                  <select
                    id="bus"
                    className={styles["custom-select"]}
                    value={type}
                    onChange={handleBusType}
                  >
                    {busTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="date">Date</label>
                  <div>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      className="datepicker-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles["trip-btn"]}>
              <Link
                to={`/booking-details`}
                onClick={() => bookTrip(tripDetails)}
              >
                <button>Book Trip</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bookings;
