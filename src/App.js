import "../src/resourses/global.css";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Home from "./components/Home";
import NavBar from "./components/navBar/NavBar";
import ContactUs from "./components/ContactUs";
import BookNow from "./pages/BookNow/BookNow";
import BookingHistory from "./pages/BookingHistory/BookingHistory";
import { ToastContainer } from "react-toastify";
import AdminOnlyRoute from "./components/adminOnlyRoute/AdminOnlyRoute";
import Admin from "./pages/admin/Admin";
import CheckOut from "./pages/CheckOut/CheckOut";
import CheckoutSuccess from "./components/PrintTicket/CheckoutSuccess";

function App() {
  return (
    <div className="h-screen bg">
      {/* <BrowserRouter> */}
      <ToastContainer />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/history" element={<BookingHistory />}></Route>
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/book" element={<BookNow />} />

        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/success" element={<CheckoutSuccess />} />

        <Route
          path="/admin/*"
          element={
            <AdminOnlyRoute>
              <Admin />
            </AdminOnlyRoute>
          }
        />
      </Routes>
      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;
