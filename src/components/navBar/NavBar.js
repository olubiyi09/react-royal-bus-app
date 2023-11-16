import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.scss";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaTimes } from "react-icons/fa";
import { auth, db } from "../../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  REMOVE_ACTIVE_USER,
  SET_ACTIVE_USER,
  selectUserID,
} from "../../redux/slice/authSlice";
import { doc, getDoc } from "firebase/firestore";
import AdminOnlyRoute from "../adminOnlyRoute/AdminOnlyRoute";
import profilePic from "../../assets/seyi.jpeg";
import { AiFillCaretDown } from "react-icons/ai";
import Loader from "../loader/Loader";
import {
  STORE_FULL_USERNAMES,
  selectUserFullList,
} from "../../redux/slice/usersSlice";

const logo = (
  <div className="logo">
    <Link to="/">
      <span>Royal</span>Bus
    </Link>
  </div>
);

const Navbar = () => {
  const [showNav, setShowNav] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const userID = useSelector(selectUserID);
  const userFullDetails = useSelector(selectUserFullList);
  const [uDetails, setUDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Monitor currently sign in user
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        // console.log(uid);

        const getDisplayName = async () => {
          const docRef = doc(db, "usernames", uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // console.log(docSnap.data().displayName);
            const dName = docSnap.data().displayName;
            const uName = dName.charAt(0).toUpperCase() + dName.slice(1);
            setDisplayName(uName);
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        };

        if (user.displayName == null) {
          getDisplayName();
          // const u1 = user.email.slice(0, -10);
          // const uName = u1.charAt(0).toUpperCase() + u1.slice(1);
          // setDisplayName(uName);
        } else {
          setDisplayName(user.displayName);
          // getDisplayName();
        }
        setIsLoggedIn(true);

        dispatch(
          SET_ACTIVE_USER({
            email: user.email,
            userName: displayName,
            userID: user.uid,
            isLoggedIn,
          })
        );
      } else {
        setDisplayName("");
        dispatch(REMOVE_ACTIVE_USER());
      }
    });
  }, []);

  const displayNav = () => {
    setShowNav(!showNav);
  };

  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        toast.success("logout successful");
        setIsLoggedIn(false);
        navigate("/");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  useEffect(() => {
    const getFullUserDetails = async () => {
      // setIsLoading(true);
      const docRef = doc(db, "userDetails", userID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        const fullD = docSnap.data();
        setUDetails(fullD);
        setIsLoading(false);
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        setIsLoading(false);
      }
    };

    getFullUserDetails();
  }, []);

  useEffect(() => {
    dispatch(STORE_FULL_USERNAMES(uDetails));
  }, [dispatch, uDetails]);

  const callAgain = () => {
    // getFullUserDetails();
  };

  useEffect(() => {
    callAgain();
  }, []);

  // console.log(uDetails.imageURL);
  const imgUrl = uDetails.imageURL;

  return (
    <>
      {isLoading && <Loader />}
      <header>
        <div className={showNav ? "header" : "header h5rem"}>
          {logo}

          <div className={showNav ? "header-right" : "header-right hide"}>
            <ul onClick={displayNav}>
              <li>
                Welcome, <b>{displayName}</b>
              </li>

              <li>
                <AdminOnlyRoute>
                  <div className="admin">
                    <Link to="/admin/home">Admin</Link>
                  </div>
                </AdminOnlyRoute>
              </li>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                {isLoggedIn ? (
                  <Link to="/history">Bookings</Link>
                ) : (
                  <Link to="/login">Login|Register</Link>
                )}
              </li>
              <li>
                {isLoggedIn && (
                  <Link to="/" onClick={logoutUser}>
                    Logout
                  </Link>
                )}
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>

            </ul>
          </div>
          <div
            className={!showNav ? "menuicon" : "hidden"}
            onClick={displayNav}
          >
            <RxHamburgerMenu size={35} />
          </div>
          <div className={showNav ? "menuicon" : "hidden"} onClick={displayNav}>
            <FaTimes size={35} />
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
