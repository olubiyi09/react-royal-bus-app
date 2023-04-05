import React, { useEffect, useState } from "react";
import { seatsData } from "../../seat-data";
import { Col, Row } from "antd";
import styles from "./SeatSelector.module.scss";
import "../../resourses/global.css";
import { toast } from "react-toastify";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import useFetchCollection from "../../customHooks/useFetchColletion";
import Loader from "../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedSeats,
  STORE_SELECTED_SEATS,
} from "../../redux/slice/seatSlice";

const SeatSelector = ({
  selectedSeats,
  setSelectedSeats,
  name,
  mySeats,
  isLoading,
  capacity,
}) => {
  //   const [selectedSeats, setSelectedSeats] = useState([]);

  //   const selectOrUnselectSeat = (id, isAvailable) => {
  //     setSelectedSeats(id);
  //     console.log(selectedSeats);
  //   };

  const [firestoreData, setFirestoreData] = useState([]);
  const [myArray, setMyArray] = useState([]);

  // const { data, isLoading } = useFetchCollection("bookedBus");
  // const mySeats = useSelector(selectSelectedSeats);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(
  //     STORE_SELECTED_SEATS({
  //       seats: data,
  //     })
  //   );
  // }, [dispatch, data]);

  // console.log(mySeats);

  useEffect(() => {
    const newSeats = mySeats.map((seatz) => {
      const { selectedSeats } = seatz;
      selectedSeats.map((num) => {
        return num;
      });
      setFirestoreData(selectedSeats);
    });
  }, [firestoreData]);
  // console.log(firestoreData);

  useEffect(() => {
    const newId = seatsData.map((seatId) => {
      const { id } = seatId;
      return id;
    });
    setMyArray(newId);
  }, []);

  const matchedData = myArray.filter((item) => firestoreData.includes(item));
  // useEffect(() => {
  //   setSeatz(matchedData);
  // }, []);
  // console.log(seat);

  const selectOrUnselectSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const bookSeat = () => {
    try {
      const ref = doc(db, "bookedBus", name);
      const docRef = setDoc(ref, {
        selectedSeats,
        createdAt: Timestamp.now().toDate(),
      });
      toast.success("Seat Booked");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className={styles["seat-wrapper"]}>
            <Row gutter={(10, 10)}>
              {seatsData.map((seat, index) => {
                const { id, isAvailable } = seat;

                let seatClass = "";
                if (selectedSeats.includes(id)) {
                  seatClass = "selected";
                } else if (matchedData.includes(id)) {
                  seatClass = "booked";
                }
                //  else if (isAvailable) {
                //   seatClass = "red";
                // }

                return (
                  <Col span={6} key={index}>
                    <div
                      className={` ${styles.seats} ${seatClass}`}
                      onClick={() => selectOrUnselectSeat(id, isAvailable)}
                    >
                      {id}
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
          <button onClick={() => bookSeat()}>Book seat</button>
        </>
      )}
    </div>
  );
};

export default SeatSelector;
