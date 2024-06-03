import React, { useEffect, useState } from "react";
import axios from "axios";

function Logs() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState({});
  const [expandedUsers, setExpandedUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          "https://nodex.goplusbet.pl/api/users/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching users");
      }
    };

    fetchUsers();
  }, []);

  const fetchLogs = async (userId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `https://nodex.goplusbet.pl/api/users/logs/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const filteredLogs = response.data.filter(
        (log) => log.action !== "LOGOUT"
      );
      setLogs((prevLogs) => ({
        ...prevLogs,
        [userId]: filteredLogs,
      }));
    } catch (error) {
      console.error("Error fetching logs:", error);
      setError("Error fetching logs");
    }
  };

  const handleUserClick = (userId) => {
    if (expandedUsers.includes(userId)) {
      setExpandedUsers(expandedUsers.filter(id => id !== userId)); // Zwiń listę logów, jeśli kliknięto ponownie
    } else {
      setExpandedUsers([...expandedUsers, userId]);
      if (!logs[userId]) {
        fetchLogs(userId); // Pobierz logi, jeśli jeszcze nie zostały pobrane
      }
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <React.Fragment key={user._id}>
              <tr onClick={() => handleUserClick(user._id)}>
                <td className="username-logs-click">{user.username} ({user.role})</td>
              </tr>
              {expandedUsers.includes(user._id) && logs[user._id] && (
                <tr>
                  <td colSpan="4" style={{ paddingLeft: '30px' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Action</th>
                          <th>Details</th>
                          <th>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs[user._id].map((log) => (
                          <tr key={log._id}>
                            <td>{log.action}</td>
                            <td>
                              {log.details}
                              {log.createdBy && ` by ${log.createdBy.username}`}
                            </td>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Logs;
