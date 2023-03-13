import React from "react";
import { Route, Routes } from "react-router-dom";
import BusForm from "./BusForm";
import styles from "../admin/Admin.module.scss";
import AdminBooking from "./AdminBooking";
import AdminBuses from "./AdminBuses";
import AdminHome from "./AdminHome";
import AdminNavBar from "./AdminNavBar";
import AdminUsers from "./AdminUsers";

const Admin = () => {
  return (
    <div className={styles.admin}>
      <div className={styles.navbar}>
        <AdminNavBar />
      </div>

      <div className={styles.content}>
        <Routes>
          <Route path="home" element={<AdminHome />} />
          <Route path="buses" element={<AdminBuses />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="bookings" element={<AdminBooking />} />
          <Route path="add-bus/:id" element={<BusForm />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
