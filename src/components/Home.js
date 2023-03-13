import React, { useState } from "react";
import "../resourses/auth.css";
import styles from "./Home.module.scss";
import { FaBusAlt } from "react-icons/fa";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../redux/slice/authSlice";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-toastify";

import { Modal } from "antd";

const Home = () => {
  const [slideNav, setSlideNav] = useState(false);
  const [ticketID, setTicketID] = useState("");

  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [ticketDetails, setTicketDetails] = useState("");
  const [showTicket, setShowTicket] = useState(false);

  const handleSlideRight = () => {
    setSlideNav(true);
  };
  const handleSlideLeft = () => {
    setSlideNav(false);
  };

  const handleBookNow = () => {
    // console.log(isLoggedIn);
    if (!isLoggedIn) {
      navigate("/login");
      console.log("yes");
    }
    if (isLoggedIn) {
      navigate("/book");
    }
  };

  const getTicket = async (e) => {
    e.preventDefault();
    setShowTicket(true);

    const docRef = doc(db, "bookings", ticketID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setTicketDetails(docSnap.data());
    } else {
      console.log("No such document!");
    }
    setTicketID("");
  };

  return (
    <section className={`container ${styles.hero}`}>
      <div className={styles["hero-content"]}>
        <h1 className={styles["hero-h1"]}>Hello</h1>
        <h2 className={styles["hero-h2"]}>
          Where are you planning to <span className={styles.visit}>visit</span>?
        </h2>
        <p className={styles["hero-p"]}>Book a trip now...</p>

        <div className={styles["hero-options"]}>
          <div className={styles["options-details"]}>
            <nav>
              <div className={styles["nav"]}>
                <label html="book" className={styles["book-trip"]}>
                  <div className={`${styles.left} `} onClick={handleSlideLeft}>
                    <FaBusAlt size={25} />
                    <span className={styles["icon-span"]}>Book Trip</span>
                  </div>
                </label>

                <label html="track" className={styles["track-booking"]}>
                  <div
                    className={`${styles.right} `}
                    onClick={handleSlideRight}
                  >
                    <MdAirlineSeatReclineNormal size={29} />
                    <span className={styles["icon-span"]}>Track Booking</span>
                  </div>
                </label>
              </div>
              <div
                className={
                  !slideNav ? `${styles.slide}` : `${styles["slide-right"]}`
                }
              ></div>
            </nav>

            {!slideNav ? (
              <div className={styles["options-content1"]}>
                <div className={styles.content}>
                  <h2>Start planning your next trip...</h2>
                  <p>
                    Are you thinking of travelling somewhere anytime soon? Click
                    the{" "}
                    <span className={styles["btn-span"]}>Book Now Button</span>{" "}
                    to see the availble buses and trip date, this will help you
                    get started.
                  </p>
                </div>

                <div className={styles["book-btn"]}>
                  <button
                    className={`--btn ${styles["book-now"]}`}
                    onClick={handleBookNow}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles["options-content2"]}>
                <form className={styles.form}>
                  <input
                    type="text"
                    placeholder="Enter a Valid Ticket ID"
                    required
                    value={ticketID}
                    onChange={(e) => setTicketID(e.target.value)}
                  />

                  <div className="track">
                    <button
                      className={`--btn --btn-danger ${styles["track-btn"]}`}
                      onClick={getTicket}
                    >
                      Track Booking
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        width={800}
        title="Ticket Details"
        open={showTicket}
        onCancel={() => setShowTicket(false)}
        footer={false}
      >
        <table className={`table table-striped table-dark ${styles.pad}`}>
          <tbody>
            <tr>
              <td>
                Ticket ID: <br /> <b>{ticketDetails.ticketID}</b>
              </td>
              <td>
                Bus Name: <br /> <b>{ticketDetails.busName}</b>
              </td>
              <td>
                Bus Number: <br /> <b>{ticketDetails.busNumber}</b>
              </td>
            </tr>
            <tr>
              <td>
                From: <br /> <b>{ticketDetails.from}</b>
              </td>
              <td>
                To: <br /> <b>{ticketDetails.to}</b>
              </td>
              <td>
                Trip Date: <br /> <b>{ticketDetails.tripDate}</b>
              </td>
            </tr>
            <tr>
              <td>
                Departure Time: <br /> <b>{ticketDetails.departure}</b>
              </td>
              <td>
                Arrival Time: <br /> <b>{ticketDetails.arrival}</b>
              </td>
              <td>
                Price: <br /> <b>${ticketDetails.price}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </Modal>
    </section>
  );
};

export default Home;
