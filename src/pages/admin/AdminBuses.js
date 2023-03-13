import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import useFetchCollection from "../../customHooks/useFetchColletion";
import styles from "./AdminBuses.module.scss";
import { toast } from "react-toastify";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import Notiflix from "notiflix";
import { useDispatch, useSelector } from "react-redux";
import { selectBuses, STORE_BUSES } from "../../redux/slice/busSlice";
import Loader from "../../components/loader/Loader";

const AdminBuses = () => {
  const { data, isLoading } = useFetchCollection("buses");
  const myBuses = useSelector(selectBuses);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      STORE_BUSES({
        buses: data,
      })
    );
  }, [dispatch, data]);

  // console.log(myBuses);

  const confirmDelete = (id) => {
    Notiflix.Confirm.show(
      "Delete Bus",
      "You are about to delete a bus?",
      "Delete",
      "Cancel",
      function okCb() {
        deleteBus(id);
      },
      function cancelCb() {
        console.log("");
      },
      {
        width: "320px",
        borderRadius: "5px",
        titleColor: "orangered",
        okButtonBackground: "orangered",
        cssAnimationStyle: "zoom",
      }
    );
  };

  const deleteBus = async (id) => {
    try {
      await deleteDoc(doc(db, "buses", id));
      toast.success("Bus Deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <div className="d-flex justify-content-between">
        <h2 style={{ color: "#fff" }} className="my-4">
          Buses
        </h2>
        <div className="">
          <button className={styles.btn}>
            <Link to="/admin/add-bus/add">Add Bus</Link>
          </button>
        </div>
      </div>

      {myBuses.length === 0 ? (
        <h1>No Bus Found</h1>
      ) : (
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th scope="col">S/N</th>
              <th scope="col">Name</th>
              <th scope="col">Number</th>
              <th scope="col">From</th>
              <th scope="col">To</th>
              <th scope="col">Trip Date</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myBuses.map((bus, index) => {
              const { id, name, number, from, to, date } = bus;

              return (
                <tr key={id}>
                  <th scope="row">{index + 1}</th>
                  <td>{name}</td>
                  <td>{number}</td>
                  <td>{from}</td>
                  <td>{to}</td>
                  <td>{date}</td>
                  <td>
                    <Link>Not Yet Started</Link>
                  </td>
                  <td>
                    <div className="d-flex gap-3">
                      <div className={styles.edit}>
                        <Link to={`/admin/add-bus/${id}`}>
                          <FaEdit color="blue" size={18} />
                        </Link>
                      </div>
                      <div
                        className={styles.delete}
                        onClick={() => confirmDelete(id)}
                      >
                        <FaTrashAlt color="red" size={18} />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBuses;
