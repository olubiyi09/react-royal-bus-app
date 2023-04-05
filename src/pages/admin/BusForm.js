import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/loader/Loader";
import { db, storage } from "../../firebase/config";
import { selectBuses } from "../../redux/slice/busSlice";
import styles from "./BusForm.module.scss";

const initialState = {
  name: "",
  number: "",
  capacity: "",
  imageUrl: "",
  from: "",
  to: "",
  date: "",
  departure: "",
  type: "",
  arrival: "",
  price: 0,
};

const BusForm = () => {
  const { id } = useParams();
  const buses = useSelector(selectBuses);
  const busEdit = buses.find((buss) => buss.id === id);

  const [bus, setBus] = useState(() => {
    const newState = detectForm(id, { ...initialState }, busEdit);
    return newState;
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBus({ ...bus, [name]: value });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // console.log(file);

    const storageRef = ref(storage, `royalBus/${Date.now()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        toast.error(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setBus({ ...bus, imageUrl: downloadURL });
          toast.success("Image uploaded succesfully.");
        });
      }
    );
  };

  const navigate = useNavigate();

  function detectForm(id, f1, f2) {
    if (id === "add") {
      return f1;
    }
    return f2;
  }

  const addBus = (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const docRef = addDoc(collection(db, "buses"), {
        name: bus.name,
        number: bus.number,
        imageUrl: bus.imageUrl,
        capacity: bus.capacity,
        from: bus.from,
        to: bus.to,
        date: bus.date,
        departure: bus.departure,
        type: bus.type,
        arrival: bus.arrival,
        price: Number(bus.price),
        createdAt: Timestamp.now().toDate(),
      });
      setIsLoading(false);
      setBus({ ...initialState });

      toast.success("Bus saved");
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }

    navigate("/admin/buses");
  };

  const editBus = (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      setDoc(doc(db, "buses", id), {
        name: bus.name,
        number: bus.number,
        // imageUrl: bus.imageUrl,
        capacity: bus.capacity,
        from: bus.from,
        to: bus.to,
        date: bus.date,
        departure: bus.departure,
        type: bus.type,
        arrival: bus.arrival,
        price: Number(bus.price),
        createdAt: bus.createdAt,
        editedAt: Timestamp.now().toDate(),
      });

      setIsLoading(false);
      toast.success("Bus Edited");
      navigate("/admin/buses");
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const closeForm = (e) => {
    e.preventDefault();
    navigate("/admin/buses");
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className={styles.wrapper}>
        <div className={styles["form-wrapper"]}>
          <h2 style={{ color: "orangered" }}>
            {detectForm(id, "Add Bus", "Edit Bus")}
          </h2>
          <form onSubmit={detectForm(id, addBus, editBus)}>
            <input
              type="text"
              required
              placeholder="Bus Name"
              name="name"
              value={bus.name}
              onChange={(e) => handleInputChange(e)}
            />

            <div className={styles.group}>
              <input
                type="text"
                required
                placeholder="Bus Number"
                name="number"
                value={bus.number}
                onChange={(e) => handleInputChange(e)}
              />

              <input
                type="text"
                required
                placeholder="Capacity"
                name="capacity"
                value={bus.capacity}
                onChange={(e) => handleInputChange(e)}
              />
            </div>

            <div className={styles.image}>
              <input
                type="file"
                accept="image/*"
                // required
                placeholder="Bus Image"
                name="image"
                onChange={(e) => handleImageChange(e)}
              />

              {bus.imageUrl === "" ? null : (
                <input
                  type="text"
                  placeholder="Image URL"
                  name="imageURL"
                  value={bus.imageUrl}
                  disabled
                />
              )}
            </div>

            <div className={styles.group}>
              <input
                type="text"
                required
                placeholder="From"
                name="from"
                value={bus.from}
                onChange={(e) => handleInputChange(e)}
              />
              <input
                type="text"
                required
                placeholder="To"
                name="to"
                value={bus.to}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
            <div className={styles.group}>
              <input
                type="date"
                required
                placeholder="Trip Date"
                name="date"
                value={bus.date}
                onChange={(e) => handleInputChange(e)}
              />
              <input
                type="text"
                required
                placeholder="Departure"
                name="departure"
                value={bus.departure}
                onChange={(e) => handleInputChange(e)}
              />

              <input
                type="text"
                required
                placeholder="Arrival"
                name="arrival"
                value={bus.arrival}
                onChange={(e) => handleInputChange(e)}
              />
            </div>

            <div className={styles.group}>
              <input
                type="text"
                required
                placeholder="Type"
                name="type"
                value={bus.type}
                onChange={(e) => handleInputChange(e)}
              />

              <input
                type="text"
                required
                placeholder="Price $"
                name="price"
                value={bus.price}
                onChange={(e) => handleInputChange(e)}
              />
            </div>

            <div className="d-flex justify-content-end">
              <button className={styles["cancel-btn"]} onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className={styles.btnn}>
                {detectForm(id, "Save Bus", "Edit Bus")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BusForm;
