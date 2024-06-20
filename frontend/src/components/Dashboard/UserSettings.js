import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBInput,
  MDBBtn,
  MDBFile
} from 'mdb-react-ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
// import "./UserDashboard.css"; // Include any other CSS if needed
import "./UserSettings.css"; // Import the CSS file

const UserSettings = () => {
  const token = localStorage.getItem("token");
  const { setUserName, setImage } = useContext(UserContext);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    userName: '',
    age: '',
    image: ''
  });
  const [message, setMessage] = useState('');
  const [image, setImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      axios
        .get(`http://localhost:5000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          setUserData(result.data.user);
        })
        .catch((err) => {
          console.error(err);
          setMessage(
            err.response?.data?.message || "Error fetching user information"
          );
        });
    }
  }, [token]);

  const handleUpdateUser = async () => {
    if (userData.password !== userData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    let imageUrl = userData.image;

    if (image) {
      imageUrl = await uploadImageToCloudinary();
      if (!imageUrl) {
        setMessage("Image upload failed");
        setTimeout(() => setMessage(""), 3000);
        return;
      }
    }

    const updatedUserData = { ...userData, image: imageUrl };
    if (!userData.password) {
      delete updatedUserData.password;
      delete updatedUserData.confirmPassword;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .put(`http://localhost:5000/users/${userData._id}`, updatedUserData, { headers })
      .then((result) => {
        setMessage(result.data.message);
        setUserName(updatedUserData.userName);  
        setImage(updatedUserData.image);        
        if (token) {
          const decodedToken = jwtDecode(token);
          const specialist = decodedToken.specialist;
          if (specialist) {
            navigate("/provider-dashboard");
          } else {
            navigate("/dashboard");
          }
        }
        setTimeout(() => setMessage(''), 3000);
      })
      .catch((err) => {
        setMessage(
          err.response?.data?.message || "Error updating user information"
        );
        setTimeout(() => setMessage(''), 3000);
      });
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const backToDashboard = () => {
    navigate("/dashboard");
  };

  const uploadImageToCloudinary = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "rgtsukxl");
    data.append("cloud_name", "dqefjpmuo");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dqefjpmuo/image/upload", {
        method: "post",
        body: data
      });
      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return null;
    }
  };

  return (
    <MDBContainer className='UserSettings'>
      <MDBCard>
        <MDBCardTitle>Update Your Information</MDBCardTitle>
        <MDBCardBody className='settings'>
          
          <div className="form-group mb-3">
            <label>First Name</label>
            <MDBInput
              type="text"
              name="firstName"
              // value={userData.firstName}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group mb-3">
            <label>Last Name</label>
            <MDBInput
              type="text"
              name="lastName"
              // value={userData.lastName}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group mb-3">
            <label>Phone Number</label>
            <MDBInput
              type="text"
              name="phoneNumber"
              // value={userData.phoneNumber}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group mb-3">
            <label>Username</label>
            <MDBInput
              type="text"
              name="userName"
              // value={userData.userName}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group mb-3">
            <label>Age</label>
            <MDBInput
              type="number"
              name="age"
              // value={userData.age}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group mb-3">
            <label>Password</label>
            <MDBInput
              type="password"
              name="password"
              // value={userData.password}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group mb-3">
            <label>Confirm Password</label>
            <MDBInput
              type="password"
              name="confirmPassword"
              // value={userData.confirmPassword}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="image" className="form-label">Image</label>
            <MDBFile
              id="image"
              onChange={handleFileChange}
            />
          </div>
          {message && <div className="alert alert-danger">{message}</div>}
          <div className='buttons'>
            <MDBBtn onClick={handleUpdateUser}>
              Update User Information
            </MDBBtn>
            <MDBBtn onClick={backToDashboard}>
              Cancel
            </MDBBtn>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default UserSettings;
