import React from "react";
import { doc, getDocs, collection, updateDoc } from "firebase/firestore";
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
    <div className="table-container">
      <h2>Manage Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>LVL / XP</th>
            <th>ID</th>
            <th>Admin</th>
            <th>Requested to be admin?</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.data.name}</td>
              <td>
                {item.data.lvl !== undefined ? item.data.lvl : 0}
                <span style={{ color: "#717171" }}> / </span>
                {item.data.xp !== undefined ? item.data.xp : 0}
              </td>
              <td className="user-id">{item.id}</td>
              <td className="main">{item.data.admin.toString()}</td>
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
