import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit ,faRemove} from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import "./AdminDashboard.css";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBFile,
} from "mdb-react-ui-kit";
import socketInit from '../../socket.server';
import Message from '../Dashboard/Message';

const AdminDashboard = () => {
  const Admin =require("../../alphabetImages/Admin.png")
  const { setIsLoggedIn, setToken, token } = useContext(UserContext);
  const [userNameOne, setUserNameOne] = useState("");
  // const [imageOne, setImageOne] = useState("");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
    const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tokenOne, setTokenOne] = useState("")
  const [user_id, setUser_id] = useState("")

  const [selectedSection, setSelectedSection] = useState("dashboard");
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState("");
  const [userName, setUserName] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");
  const [isSpecialist, setIsSpecialist] = useState(false);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);


  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/serviceCategory/"
        );
        if (response.data.success) {
          setCategories(response.data.categories);
        } else {
          console.error("No categories found");
        }
      } catch (error) {
        console.error("Error fetching service categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };
  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
      const userName = decodedToken.user;
      setUserNameOne(userName);
     

      getAllUsers();
    }
  }, [token]);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/providerInfo/reviews");
        if (response.data.success) {
          setReviews(response.data.reviews);
        } else {
          console.error("No reviews found");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
  
    fetchReviews();
  }, []);
  
  

  const getAllUsers = () => {
    axios
      .get("http://localhost:5000/users/")
      .then((result) => {
        setUsers(result.data.Users);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDeleteReviews = async (reviewId) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
  
      const response = await axios.delete(`http://localhost:5000/providerInfo/${reviewId}/reviews`, { headers });
  
      if (response.status === 200 && response.data.success) {
        setReviews(reviews.filter((review) => review._id !== reviewId));
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };
  

  const handleDelete = (userId) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .delete(`http://localhost:5000/users/${userId}`, { headers })
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
    
    console.log(`Update user with ID: ${userId}`);
  };
  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "rgtsukxl");
    formData.append("cloud_name", "dqefjpmuo");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dqefjpmuo/image/upload",
        {
          method: "post",
          body: formData,
        }
      );
      const result = await response.json();
      const imageUrl = result.url;

      const userData = {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        image: imageUrl,
        userName,
        age,
        specialist: isSpecialist ? specialist : null,
      };

      const registerResponse = await axios.post(
        "http://localhost:5000/users/register",
        userData
      );

      if (registerResponse.data.success) {
        setMessage(registerResponse.data.message);
        setUsers([...users, registerResponse.data.user]);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(registerResponse.data.message || "Registration failed");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      setMessage("Image upload failed");
      setTimeout(() => setMessage(""), 3000);
    }
  };


  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken("");
    localStorage.clear();
    navigate("/login");
  };

  const barData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Sales",
        data: [65, 59, 80, 81, 56],
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const lineData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Orders",
        data: [85, 69, 90, 91, 76],
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const pieData = {
    labels: ["Amman", "Irbid", "Aqaba"],
    datasets: [
      {
        label: "Population",
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const doughnutData = {
    labels: ["Oil Change", "Tire Replacement", "Engine Repair"],
    datasets: [
      {
        label: "Population",
        data: [200, 500, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };



  return (
    <div className="d-flex flex-column">
      <nav
        id="topbar"
        className="bg-dark p-3 d-flex justify-content-between align-items-center"
      >
        <div className="d-flex align-items-center">
         
            <img
              src={Admin}
              alt="User"
              className="rounded-circle mr-2"
              style={{ width: "40px", height: "40px" }}
            />
          
          <span className="text-white">{userNameOne}</span>
        </div>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </nav>
      <div className="d-flex">
        <nav id="sidebar" className="bg-dark">
          <div className="p-4">
            <h1 className="logo">Admin</h1>
          
            <ul className="list-unstyled components mb-5">
              <li>
                <a href="#adminDashboard"
                onClick={()=>setSelectedSection("adminDashboard")}
                className="dropdown-toggle"
                >
                  Admin Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#userDashboard"
                  onClick={() => setSelectedSection("userDashboard")}
                  className="dropdown-toggle"
                >
                  User Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#providerDashboard"
                  onClick={() => setSelectedSection("providerDashboard")}
                  className="dropdown-toggle"
                >
                  Provider Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#users"
                  onClick={() => setSelectedSection("userManagement")}
                  className="dropdown-toggle"
                >
                  User Management
                </a>
              </li>
              <li>
  <a
    href="#reviews"
    onClick={() => setSelectedSection("reviews")}
    className="dropdown-toggle"
  >
    Reviews
  </a>
</li>

              <li>
                <a
                  href="#charts"
                  onClick={() => setSelectedSection("charts")}
                  className="dropdown-toggle"
                >
                  Charts
                </a>
              </li>
              <li>
                <a
                  href="#createUsers"
                  onClick={() => setSelectedSection("createUsers")}
                  className="dropdown-toggle"
                >
                  Create Users
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div id="content" className="p-4 p-md-5">
        {selectedSection === "adminDashboard" && (
  <div>
    <h1>Admin Dashboard</h1>
 
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-lg-6">
          <Bar data={barData} />
        </div>
        <div className="col-lg-6">
          <Line data={lineData} />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-lg-6">
          <Pie data={pieData} />
        </div>
        <div className="col-lg-6">
          <Doughnut data={doughnutData} />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <h3>Reviews</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Profile Picture</th>
                <th>User Name</th>
                <th>Review</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td><img className="avatar-image" src={review.customer.image} alt="Avatar"/></td>
                  <td>{review.customer.userName}</td>
                  <td>{review.review}</td>
                  <td>{review.rating}</td>
                
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-lg-12 mt-4">
          <h3>Users</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                
                <th>Profile Picture</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td><img className="avatar-image" src={user.image}alt="Avatar"/></td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.role.role}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)}
          {selectedSection === "userDashboard" && (
            <h2>Hello from User Dashboard</h2>
          )}
          {selectedSection === "providerDashboard" && (
            <h2>Hello from Provider Dashboard</h2>
          )}
          {selectedSection === "userManagement" && (
            <>
              <h2>User Management</h2>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>Profile Picture</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Phone Number</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td><img className="avatar-image" src={user.image} alt="Avatar"/></td>
                        <td>{user.userName}</td>
                        <td>{user.email}</td>
                        <td>{user.role.role}</td>
                        <td>{user.phoneNumber}</td>
                        
                        <td>
                          <button
                            onClick={() => handleUpdate(user._id)}
                            className="btn btn-sm btn-primary mr-2"
                            disabled={user.role.role === "Admin"}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="btn btn-sm btn-danger"
                            disabled={user.role.role === "Admin"}
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
          {selectedSection === "reviews" && (
  <>
    <h2>Reviews</h2>
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Customer Name</th>
            <th>Review</th>
            <th>Rating</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id}>
              {console.log(review)}
              <td>{review.customer.userName}</td>
              <td>{review.review}</td>
              <td>{review.rating}</td>
              <td>{new Date(review.date).toLocaleDateString()}</td>
              <td>
              <button
          onClick={() => handleDeleteReviews(review._id)}
          className="btn btn-sm btn-danger"
        >
          <FontAwesomeIcon icon={faRemove} />
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
          {selectedSection === "createUsers" && (
            <MDBContainer fluid className="p-4 register-container">
              <MDBCard className="text-black">
                <MDBCardBody className="p-md-5">
                  <h3 className="text-center">Sign up</h3>
                  <div className="register-form">
                    <div className="form-left">
                      <MDBInput
                        label="First Name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <MDBInput
                        label="Last Name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      <MDBInput
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <MDBInput
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <MDBInput
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <MDBInput
                        label="Phone Number"
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      <MDBInput
                        label="User Name"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                      <MDBInput
                        label="Age"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                      <label htmlFor="image" className="form-label">
                        Image
                      </label>
                      <MDBFile className="form-group mb-3" id="image" onChange={handleFileChange} />
                      <div className="specialist-checkbox">
                        <MDBCheckbox
                          name="isSpecialist"
                          id="isSpecialist"
                          label="Are you a specialist?"
                          checked={isSpecialist}
                          onChange={(e) => setIsSpecialist(e.target.checked)}
                        />
                      </div>
                      {isSpecialist && (
                        <div className="mb-3">
                          <label htmlFor="specialist" className="form-label">
                            Specialty
                          </label>
                          <select
                            id="specialist"
                            className="form-select"
                            value={specialist}
                            onChange={(e) => setSpecialist(e.target.value)}
                          >
                            <option value="">Select a specialty</option>
                            {categories.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <MDBBtn className="w-100 mt-3" onClick={handleSubmit}>
                        Register
                      </MDBBtn>
                    </div>
                    <div className="form-right">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                        className="img-fluid"
                        alt="Sample"
                      />
                    </div>
                  </div>
                  {message && <p className="text-danger mt-2">{message}</p>}
                </MDBCardBody>
              </MDBCard>
            </MDBContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
