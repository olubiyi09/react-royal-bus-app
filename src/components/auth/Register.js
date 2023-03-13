import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../resourses/auth.css";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { GoPrimitiveDot } from "react-icons/go";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import Loader from "../loader/Loader";
import { selectIsLoggedIn } from "../../redux/slice/authSlice";
import { useSelector } from "react-redux";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";

const Register = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  // Password Indicator
  const [showIndicator, setShowIndicator] = useState(false);
  const [passLetter, setPassLetter] = useState(false);
  const [passChar, setPassChar] = useState(false);
  const [passLength, setPassLength] = useState(false);
  const [passComplete, setPassComplete] = useState(false);

  useEffect(() => {
    // Check Lower and UpperCase
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      setPassLetter(true);
    } else {
      setPassLetter(false);
    }
    if (password.match(/([!,@,#,$,%,^,&,*,_,+,~,.,,])/)) {
      setPassChar(true);
    } else {
      setPassChar(false);
    }
    if (password.length >= 8) {
      setPassLength(true);
    } else {
      setPassLength(false);
    }
  }, [password]);

  const registerUser = (e) => {
    e.preventDefault();

    if (password !== cPassword) {
      toast.error("Passwords do not match");
    } else {
      setIsLoading(true);

      createUserWithEmailAndPassword(auth, email, password, displayName)
        .then((userCredential) => {
          const user = userCredential.user;
          user.displayName = displayName;
          // console.log(user);
          setIsLoading(false);
          toast.success("Registration Successful...");

          setDisplayName("");
          setEmail("");
          setPassword("");
          setCPassword("");

          navigate("/");

          try {
            const ref = doc(db, "usernames", user.uid);
            const docRef = setDoc(ref, {
              displayName: displayName,
              email: email,
              createdAt: Timestamp.now().toDate(),
            });
          } catch (error) {
            toast.error(error.message);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          toast.error(error.message);
        });
    }
  };

  const passwordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const cPasswordVisibility = () => {
    setShowCPassword(!showCPassword);
  };
  const handleShowIndicator = () => {
    setShowIndicator(true);
  };

  return (
    <>
      {isLoading && <Loader />}
      {isLoggedIn ? (
        <h2 className="else">
          A user is already Logged In Please logout to Register a new user
        </h2>
      ) : (
        <div className="my-screen d-flex justify-content-center align-items-center">
          <div className="w-450 card p-4 form-bg">
            <h1 className="register text-2xl">Register</h1>
            <hr />

            <form onSubmit={registerUser}>
              <input
                type="text"
                placeholder="UserName"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="password">
                <input
                  onFocus={handleShowIndicator}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="icons icon-1" onClick={passwordVisibility}>
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
                <input
                  type={showCPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  required
                  value={cPassword}
                  onChange={(e) => setCPassword(e.target.value)}
                />
                <span className="icons icon-2" onClick={cPasswordVisibility}>
                  {showCPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center py-4">
                <div className="link">
                  <Link to="/login">Click Here To Login</Link>
                </div>
                <button type="submit" className="--btn --btn-danger">
                  Register
                </button>
              </div>

              {/* Password strength Indicator */}
              <div
                className={
                  showIndicator ? "pass show-indicator" : "pass hide-indicator"
                }
              >
                <ul className="--list-style-none ">
                  <li className={passLetter ? "pass-green" : "pass-red"}>
                    <span className="span-sm --align-center">
                      {passLetter ? <FaCheck /> : <GoPrimitiveDot />}
                      &nbsp; Lowercase & Uppercase
                    </span>
                  </li>
                  <li className={passChar ? "pass-green" : "pass-red"}>
                    <span className="span-sm">
                      {passChar ? <FaCheck /> : <GoPrimitiveDot />}
                      &nbsp; Special Character(!@#$%^&*)
                    </span>
                  </li>
                  <li className={passLength ? "pass-green" : "pass-red"}>
                    <span className="span-sm">
                      {passLength ? <FaCheck /> : <GoPrimitiveDot />}
                      &nbsp; At least 8 Characters
                    </span>
                  </li>
                </ul>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
