import React from "react";
import styles from "./ContactUs.module.scss";
import { GoLocation } from "react-icons/go";
import { MdCall } from "react-icons/md";
import { AiOutlineMail } from "react-icons/ai";

const ContactUs = () => {
  return (
    <div className={styles["contact-container"]}>
      <div className={`${styles["pt"]} ${styles["contact-content"]}`}>
        <div className={styles["contact-header"]}>
          <h1>Contact Us</h1>
          <p>
            We offer first class services and We also offer assistance in
            reserving school buses and coach buses for larger groups and out of
            state trips. Contact Us to make further Enquiry
          </p>
        </div>

        <div className={styles["contact-details"]}>
          <div className={styles["left-details"]}>
            <div className={styles.details}>
              <div className={styles.icon}>
                <GoLocation size={35} />
              </div>
              <div>
                <h5>Address</h5>
                <p>
                  48 New road Dadiani,
                  <br /> Tbilisi Georgia
                </p>
              </div>
            </div>

            <div className={styles.details}>
              <div className={styles.icon}>
                <MdCall size={35} />
              </div>
              <div>
                <h5>Phone</h5>
                <p>550-989-1284</p>
              </div>
            </div>

            <div className={styles.details}>
              <div className={styles.icon}>
                <AiOutlineMail size={35} />
              </div>

              <div>
                <h5>Email</h5>
                <p>royalbus123@example.com</p>
              </div>
            </div>
          </div>

          <div className={styles["right-details"]}>
            <form>
              <h3>Send Message</h3>

              <input
                type="text"
                placeholder="Full Name"
                required
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="text"
                placeholder="Email"
                required
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="text"
                placeholder="Type your Message here..."
                required
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
              />

              <div className={styles.button}>
                <button className="--btn --btn-danger">Send</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
