import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import { Modal, Button } from "antd";
import profilePic from "../../assets/default-profile-pic.jpg";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
// import useFetchDocument from "../../customHooks/useFetchDocument";
import { selectUserID } from "../../redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import useFetchCollection from "../../customHooks/useFetchColletion";
import { STORE_USERNAMES, selectUserList } from "../../redux/slice/usersSlice";
import { Timestamp, doc, setDoc } from "firebase/firestore";

const Profile = () => {
  const [profilePicture, setProfilePicture] = useState("");
  const [visible, setVisible] = useState(false);
  const [myDp, setMyDp] = useState("");
  const [file, setFile] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [filename, setFilename] = useState("");

  const dispatch = useDispatch();
  const { data, isLoading } = useFetchCollection("usernames");

  useEffect(() => {
    dispatch(STORE_USERNAMES(data));
  }, [dispatch, data]);

  const userID = useSelector(selectUserID);
  const userList = useSelector(selectUserList);
  // const userz = useFetchDocument("usernames", userID);

  const thisUser = userList.filter((user) => user.id === userID);

  console.log(thisUser);

  const navigate = useNavigate();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [visible]);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const modalFooter = (
    <div>
      <Button type="primary" onClick={handleOk}>
        OK
      </Button>
    </div>
  );

  const handleProfilePictureChange = (event) => {
    // Handle profile picture change logic here
    const file = event.target.files[0];
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes
    const reader = new FileReader();

    // console.log(file.name);
    setFile(file);
    setMyDp(file.name);

    if (file && file.size <= maxSize) {
      reader.onload = (e) => {
        setProfilePicture(e.target.result);
      };

      reader.readAsDataURL(file);
    } else {
      showModal();
    }
  };

  if (profilePicture === "") {
    setProfilePicture(profilePic);
  }

  const handleCancelBtn = () => {
    navigate("/");
  };

  const saveProfile = (e) => {
    e.preventDefault();
    // const storageRef = ref(storage, `profilepics/${Date.now()}${myDp}`);
    // const uploadTask = uploadBytesResumable(storageRef, file);

    // uploadTask.on(
    //   "state_changed",
    //   (snapshot) => {
    //     const progress =
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     console.log("Upload is " + progress + "% done");
    //   },
    //   (error) => {
    //     toast.error("Failed to upload");
    //   },
    //   () => {
    //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //       setFilename(file);
    //       setImageURL(downloadURL);

    //       const newUserDetails = thisUser.map((user) => {
    //         const { id, displayName, email } = user;
    //         return { id, displayName, email, imageURL };
    //       });

    //       console.log(...newUserDetails);
    //       try {
    //         setDoc(doc(db, "usernames", userID), {
    //           ...newUserDetails,
    //           createdAt: Timestamp.now().toDate(),
    //         });
    //         toast.success("Seat Booked");
    //       } catch (error) {
    //         toast.error(error.message);
    //       }
    //     });
    //   }
    // );
  };

  return (
    <>
      <div className={styles["form-wrap"]}>
        <div>
          <h2>Profile Settings</h2>
          <div className={styles["profile-pic-sec-wrap"]}>
            <div className={styles["profile-settings-cont"]}>
              <div className={styles["display-name"]}>
                <h3>Okediya Meshach</h3>
                <h6>@meshTech</h6>
              </div>
              <div className={styles["profile-picture"]}>
                <img src={profilePicture} alt="Profile" />
                <input
                  type="file"
                  id="profile-picture-input"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
                <label htmlFor="profile-picture-input">
                  Upload Profile Picture
                </label>

                <div className={styles["image-info"]}>
                  <p>
                    Upload a profile picture, Larger image will be resized
                    automatically.
                  </p>
                  <p>
                    Maximum upload size is <b>1 MB</b>
                  </p>
                </div>
              </div>
            </div>

            <div className={styles["profile-settings-container"]}>
              <form className={styles["profile-settings-form"]}>
                <div className={`${styles["div-combo"]}`}>
                  <div className={styles["form-group"]}>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" />
                  </div>
                  <div className={styles["form-group"]}>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" />
                  </div>
                </div>
                <div className={styles["form-group"]}>
                  <label htmlFor="email">Email Address:</label>
                  <input type="email" id="email" name="email" />
                </div>
                <div className={`${styles["div-combo"]}`}>
                  <div className={styles["form-group"]}>
                    <label htmlFor="phone">Phone:</label>
                    <input type="text" id="phone" name="phone" />
                  </div>
                  <div className={styles["form-group"]}>
                    <label htmlFor="city">City:</label>
                    <input type="text" id="city" name="city" />
                  </div>
                </div>
                <div className={styles["form-group"]}>
                  <label htmlFor="country">Country:</label>
                  <input type="text" id="country" name="country" />
                </div>
                <div className={`${styles["div-combo"]}`}>
                  <div className={styles["form-group"]}>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" />
                  </div>
                  <div className={styles["form-group"]}>
                    <label htmlFor="confirm-password">Confirm Password:</label>
                    <input
                      type="password"
                      id="confirm-password"
                      name="confirm-password"
                    />
                  </div>
                </div>
                <div className={styles["profile-btns"]}>
                  <button
                    className={`${styles["p-btn1"]}`}
                    onClick={() => handleCancelBtn()}
                  >
                    Cancel
                  </button>
                  <button onClick={saveProfile}>Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Modal
          open={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={modalFooter}
        >
          <p>Please select a file not more than 1MB in size.</p>
        </Modal>
      </div>
    </>
  );
};

export default Profile;
