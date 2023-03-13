import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader/Loader";
import useFetchCollection from "../../customHooks/useFetchColletion";
import { selectUserList, STORE_USERNAMES } from "../../redux/slice/usersSlice";

const AdminUsers = () => {
  const { data, isLoading } = useFetchCollection("usernames");
  const allUsers = useSelector(selectUserList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(STORE_USERNAMES(data));
  }, [dispatch, data]);

  return (
    <>
      {isLoading && <Loader />}
      <div>
        <h2 style={{ color: "#fff" }} className="my-4">
          Registered Users
        </h2>

        {allUsers.length === 0 ? (
          <h1>No User Found</h1>
        ) : (
          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">User ID</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user, index) => {
                const { id, displayName, email, createdAt } = user;

                return (
                  <tr key={id}>
                    <th scope="row">{index + 1}</th>
                    <td>{id}</td>
                    <td>{displayName}</td>
                    <td>{email}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AdminUsers;
