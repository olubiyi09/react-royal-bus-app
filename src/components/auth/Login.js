import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../../firebase/config";
import { selectIsLoggedIn } from "../../redux/slice/authSlice";
import "../../resourses/auth.css";
import Loader from "../loader/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const userLoggedIn = useSelector(selectIsLoggedIn);

  const LoginUser = (e) => {
    e.preventDefault();
    setIsLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setIsLoading(false);
        toast.success("Login successful...");
        setEmail("");
        setPassword("");
        setIsLoggedIn(true);
        navigate("/");
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message);
      });
  };

  const passwordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {isLoading && <Loader />}
      {userLoggedIn ? (
        <h2 className="else">
          A user is already Logged In Please go to Home page
        </h2>
      ) : (
        <div className="h-screen d-flex justify-content-center align-items-center">
          <div className="w-450 card p-4 form-bg">
            <h1 className="register text-2xl">Login</h1>
            <hr />

            <form onSubmit={LoginUser}>
              <input
                type="text"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="password">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="icons icon-1" onClick={passwordVisibility}>
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center py-4">
                <div className="link">
                  <Link to="/register">Click Here To Register</Link>
                </div>
                <button type="submit" className="--btn --btn-danger">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
