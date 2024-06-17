import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import {jwtDecode} from 'jwt-decode';
import "./AdminDashboard.css"
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { setIsLoggedIn, setToken, token } = useContext(UserContext);

  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [image, setImage] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
      const userName = decodedToken.user;
      setUserName(userName);
      const image = decodedToken.image;
      setImage(image);
      const role = decodedToken.role;
      setRole(role);
      getAllUsers();
    }
  }, [token]);

  const getAllUsers = () => {
    axios.get("http://localhost:5000/users/")
      .then((result) => {
        setUsers(result.data.Users);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (userId) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios.delete(`http://localhost:5000/users/${userId}`, { headers })
      .then((result) => {
        if (result.status === 200 && result.data.success) {
          setUsers(users.filter((user) => user._id !== userId));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleUpdate = () => {
    // Add update logic here
    console.log(`Update user with ID: ${userId}`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken("");
    localStorage.clear();
    navigate('/login');
  };

  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81, 56],
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Orders',
        data: [85, 69, 90, 91, 76],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const pieData = {
    labels: ['Amman', 'Irbid', 'Aqaba'],
    datasets: [
      {
        label: 'Population',
        data: [300, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const doughnutData={
    labels:["Oil Change","Tire Replacement","Engine Repair"],
    datasets:[{
      label: 'Population',
        data: [200, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    }]
  }

  return (
    <div className="d-flex flex-column">
      <nav id="topbar" className="bg-dark p-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          {image && <img src={image} alt="User" className="rounded-circle mr-2" style={{ width: '40px', height: '40px' }} />}
          <span className="text-white">{userName}</span>
        </div>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </nav>
      <div className="d-flex">
        <nav id="sidebar" className="bg-dark">
          <div className="p-4">
            <h1 className="logo">Admin</h1>
            <ul className="list-unstyled components mb-5">
              <li>
                <a href="#userDashboard" onClick={() => setSelectedSection('userDashboard')} className="dropdown-toggle">User Dashboard</a>
              </li>
              <li>
                <a href="#providerDashboard" onClick={() => setSelectedSection('providerDashboard')} className="dropdown-toggle">Provider Dashboard</a>
              </li>
              <li>
                <a href="#users" onClick={() => setSelectedSection("userManagement")} className="dropdown-toggle">User Management</a>
              </li>
              <li>
                <a href="#charts" onClick={() => setSelectedSection("charts")} className="dropdown-toggle">Charts</a>
              </li>
            </ul>
          </div>
        </nav>
        <div id="content" className="p-4 p-md-5">
          {selectedSection === 'userDashboard' && (
            <h2>Hello from User Dashboard</h2>
          )}
          {selectedSection === 'providerDashboard' && (
            <h2>Hello from Provider Dashboard</h2>
          )}
          {selectedSection === "userManagement" && (
            <>
              <h2>User Management</h2>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Specialist</th>
                      <th>Permissions</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.userName}</td>
                        <td>{user.email}</td>
                        <td>{user.role.role}</td>
                        <td>{user.specialist?.name}</td>
                        <td>{user.role.permissions.join(', ')}</td>
                        <td>
                          <button
                            onClick={() => handleUpdate(user._id)}
                            className="btn btn-sm btn-primary mr-2"
                            disabled={user.role.role === 'Admin'}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="btn btn-sm btn-danger"
                            disabled={user.role.role === 'Admin'}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {selectedSection === "charts" && (
            <>
              <h2>Charts</h2>
              <div className="row">
                <div className="col-md-6">
                  <h3>Sales Chart</h3>
                  <Bar data={barData} />
                </div>
                <div className="col-md-6">
                  <h3>Orders Chart</h3>
                  <Line data={lineData} />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-6">
                  <h3>Location Chart</h3>
                  <Pie data={pieData} />
                </div>
                <div className="col-md-6">
                  <h3>Services Chart</h3>
                  <Doughnut data={doughnutData} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
