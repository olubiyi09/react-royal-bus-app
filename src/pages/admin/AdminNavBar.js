import styles from "./AdminNavBar.module.scss";
import {
  FaUserCircle,
  FaHome,
  FaBusAlt,
  FaUserPlus,
  FaHistory,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { REMOVE_ACTIVE_USER } from "../../redux/slice/authSlice";
import { useDispatch } from "react-redux";

const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : "");

const AdminNavBar = () => {
  const [displayName, setDisplayName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;

        const getDisplayName = async () => {
          const docRef = doc(db, "usernames", uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // console.log(docSnap.data().displayName);
            const dName = docSnap.data().displayName;
            const uName = dName.charAt(0).toUpperCase() + dName.slice(1);
            setDisplayName(uName);
          } else {
          }
        };

        if (user.displayName == null) {
          getDisplayName();
        } else {
          setDisplayName(user.displayName);
        }

        setIsLoggedIn(true);
      } else {
        setDisplayName("");
        dispatch(REMOVE_ACTIVE_USER());
      }
    });
  }, []);

  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        toast.success("logout successful");
        navigate("/");
        setIsLoggedIn(false);
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.user}>
        <FaUserCircle size={40} color="#fff" />
        <h4>{displayName}</h4>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/admin/home" className={activeLink}>
              <div className={styles.icon}>
                <FaHome />
              </div>{" "}
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/buses" className={activeLink}>
              <div className={styles.icon}>
                <FaBusAlt />
              </div>{" "}
              Buses
            </NavLink>
          </li>
          <li>
            <NavLink to="users" className={activeLink}>
              <div className={styles.icon}>
                <FaUserPlus />
              </div>{" "}
              Users
            </NavLink>
          </li>
          <li>
            <NavLink to="bookings" className={activeLink}>
              <div className={styles.icon}>
                <FaHistory />
              </div>{" "}
              Bookings
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminNavBar;
