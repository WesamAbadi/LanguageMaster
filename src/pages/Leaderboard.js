import React from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase-config";

function Leaderboard() {
  const [data, setData] = React.useState([]);
  const [sortBy, setSortBy] = React.useState("name");
  const [sortOrder, setSortOrder] = React.useState("asc");

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      const sortedData = usersData.sort((a, b) => {
        const aValue = a.data[sortBy] || 0;
        const bValue = b.data[sortBy] || 0;

        if (sortOrder === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });

      setData(sortedData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSort = (criteria) => {
    if (criteria === sortBy) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(criteria);
      setSortOrder("asc");
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, [sortBy, sortOrder]);

  return (
    <div className="table-container">
      <h2>Leaderboard - Users</h2>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("xp")}>LVL / XP</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
