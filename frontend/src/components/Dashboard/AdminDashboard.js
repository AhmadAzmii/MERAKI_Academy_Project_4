import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
      getAllUsers();
    }
  }, []);

  const getAllUsers = () => {
    axios.get("http://localhost:5000/users/")
      .then((result) => {
        setUsers(result.data.Users);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="AdminDashboard">
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Specialist</th>
            <th>Permissions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>{user.role.role}</td>
              <td>{user.specialist?.name}</td>
              <td>{user.role.permissions.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
