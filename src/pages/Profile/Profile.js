import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import { Modal, Button } from "antd";
import profilePic from "../../assets/default-profile-pic.jpg";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import useFetchDocument from "../../customHooks/useFetchDocument";
import { selectUserID } from "../../redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import useFetchCollection from "../../customHooks/useFetchColletion";
import {
  STORE_FULL_USERNAMES,
  STORE_USERNAMES,
  selectUserFullList,
  selectUserList,
} from "../../redux/slice/usersSlice";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Profile = () => {
  const [profilePicture, setProfilePicture] = useState("");
  const [visible, setVisible] = useState(false);
  const [myDp, setMyDp] = useState("");
  const [file, setFile] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [disDetails, setDisDetails] = useState("");
  const [saveBtn, setSaveBtn] = useState(true);

  const [uDetails, setUDetails] = useState("");
  const [displayPic, setDisplayPic] = useState("");

  const dispatch = useDispatch();
  const userID = useSelector(selectUserID);
  const userFullDetails = useSelector(selectUserFullList);
  const { data, isLoading } = useFetchCollection("usernames");
  const { document } = useFetchDocument("userDetails", userID);

  useEffect(() => {
    dispatch(STORE_USERNAMES(data));
  }, [dispatch, data]);

  useEffect(() => {
    setDisDetails(document);
  }, [document]);

  const userList = useSelector(selectUserList);

  const thisUser = userList.filter((user) => user.id === userID);

  const userName = thisUser.map((user) => {
    const { displayName } = user;
    return displayName;
  });

  const userEmail = thisUser.map((user) => {
    const { email } = user;
    return email;
  });

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

    setFile(file);
    setMyDp(file.name);

    if (file && file.size <= maxSize) {
      reader.onload = (e) => {
        setProfilePicture(e.target.result);
        setDisplayPic(e.target.result);
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

    const storageRef = ref(storage, `profilepics/${Date.now()}${myDp}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        toast.error("Failed to upload");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          try {
            const ref = doc(db, "userDetails", userID);
            const docRef = setDoc(ref, {
              imageURL: downloadURL,
              uFullName: fullName,
              phone,
              city,
              country,
              userID,
            });
            toast.success("saved");
          } catch (error) {
            toast.error(error.message);
          }
        });
      }
    );

    navigate("/");
  };

  // console.log(disDetails);

  useEffect(() => {
    const getFullUserDetails = async () => {
      // setIsLoading(true);
      const docRef = doc(db, "userDetails", userID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        const fullD = docSnap.data();
        setUDetails(fullD);
        // setIsLoading(false);
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        // setIsLoading(false);
      }
    };

    getFullUserDetails();
  }, []);

  useEffect(() => {
    dispatch(STORE_FULL_USERNAMES(uDetails));
  }, [dispatch, uDetails]);

  // console.log(uDetails.userID);
  const imgUrl = uDetails.imageURL;

  useEffect(() => {
    if (displayPic === "") {
      setDisplayPic(profilePic);
    } else if (displayPic === undefined) {
      setDisplayPic(profilePic);
    } else {
      setDisplayPic(userFullDetails.imageURL);
    }
  }, [userFullDetails.imageURL]);

  useEffect(() => {
    if (userID === uDetails.userID) {
      setSaveBtn(false);
    }
  }, []);

  return (
    <>
      <div className={styles["form-wrap"]}>
        <div>
          <h2>Profile Settings</h2>
          <div className={styles["profile-pic-sec-wrap"]}>
            <div className={styles["profile-settings-cont"]}>
              <div className={styles["display-name"]}>
                <h3>{uDetails.uFullName}</h3>
                <h6>@{userName}</h6>
              </div>
              <div className={styles["profile-picture"]}>
                <img src={displayPic} alt="Profile" />
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
                    <label htmlFor="name">Full Name:</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={uDetails.uFullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className={styles["form-group"]}>
                    <label htmlFor="username">Username:</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={userName}
                      disabled
                    />
                  </div>
                </div>
                <div className={styles["form-group"]}>
                  <label htmlFor="email">Email Address:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userEmail}
                    disabled
                  />
                </div>
                <div className={`${styles["div-combo"]}`}>
                  <div className={styles["form-group"]}>
                    <label htmlFor="phone">Phone:</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={uDetails.phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className={styles["form-group"]}>
                    <label htmlFor="city">City:</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={uDetails.city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles["form-group"]}>
                  <label htmlFor="country">Country:</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={uDetails.country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
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
                  {saveBtn && (
                    <>
                      <button
                        className={`${styles["p-btn1"]}`}
                        onClick={() => handleCancelBtn()}
                      >
                        Cancel
                      </button>
                      <button onClick={saveProfile}>Save Changes</button>
                    </>
                  )}
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
