import React from "react";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase-config";

function ManageUsers() {
  const [data, setData] = React.useState([]);
  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setData(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleToggleAdmin = async (userId, currentAdminStatus) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        admin: !currentAdminStatus,
      });
      fetchUsers();
    } catch (error) {
      console.error("Error updating admin status:", error);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Admin</th>
            <th>Request to be admin?</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.data.name}</td>
              <td>{item.id}</td>
              <td>{item.data.admin.toString()}</td>
              <td>
                {item.data.requestedAdminRights
                  ? item.data.requestedAdminRights.toString()
                  : "false"}
              </td>
              <td>
                <button
                  onClick={() => handleToggleAdmin(item.id, item.data.admin)}
                >
                  Toggle Admin
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageUsers;
