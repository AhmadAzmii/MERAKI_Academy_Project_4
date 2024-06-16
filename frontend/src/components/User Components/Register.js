import axios from 'axios';
import React, { useState, useEffect, createContext } from 'react';
import './Register.css';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBFile
  } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

export const UserInfoContext=createContext()
const Register = () => {
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
    const navigate = useNavigate();
    const [confirmPassword, setConfirmPassword] = useState("")

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/serviceCategory/");
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

    const handleSubmit = async () => {

        if(password !== confirmPassword){
            setMessage("Passwords do not match");
            setTimeout(() => setMessage(""), 3000);
        }
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = async () => {
            const image = reader.result;

            const userData = {
                firstName,
                lastName,
                email,
                password,
                phoneNumber,
                image: image,
                userName,
              
                age,
                specialist: isSpecialist ? specialist : null
            };

            try {
                const response = await axios.post("http://localhost:5000/users/register", userData);
                setMessage(response.data.message);
                setTimeout(() => setMessage(""), 3000);
            } catch (error) {
                setMessage(error.response?.data?.message || "Registration failed");
                setTimeout(() => setMessage(""), 3000);
            }
        };
        reader.onerror = () => {
            setMessage("Failed to read the image file");
            setTimeout(() => setMessage(""), 3000);
        };
    };
    return (
        <UserInfoContext.Provider value={{ image, setImage, userName, setUserName }}>
          <MDBContainer className="d-flex align-items-center justify-content-center min-vh-100">
            <MDBCard style={{ maxWidth: '900px', width: '100%', backgroundColor: '#e3f2fd' }}>
              <MDBCardBody>
                <h3 className="text-center mb-4">Registration</h3>
                <MDBRow>
                  <MDBCol md="6">
                    <div className="mb-3">
                      <label htmlFor="firstName" className="form-label">First Name</label>
                      <MDBInput
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="lastName" className="form-label">Last Name</label>
                      <MDBInput
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="age" className="form-label">Age</label>
                      <MDBInput
                        id="age"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                      <MDBInput
                        id="phoneNumber"
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="userName" className="form-label">User Name</label>
                      <MDBInput
                        id="userName"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
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
                        <label htmlFor="specialist" className="form-label">Specialty</label>
                        <select
                          id="specialist"
                          className="form-select"
                          value={specialist}
                          onChange={(e) => setSpecialist(e.target.value)}
                        >
                          <option value="">Select a specialty</option>
                          {categories.map((category) => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </MDBCol>
                  <MDBCol md="6">
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <MDBInput
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <MDBInput
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                      <MDBInput
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="image" className="form-label">Image</label>
                      <MDBFile
                        id="image"
                        onChange={handleFileChange}
                      />
                    </div>
                  </MDBCol>
                </MDBRow>
                <MDBBtn className="w-100 mb-3" onClick={handleSubmit}>
                  Register
                </MDBBtn>
                <div className="text-center">
                <p className="text-center mt-3">
                    Already have an account? <a href="#!" className="text-decoration-none"onClick={() => navigate('/login')}>
                      Login
                    </a>
                  </p>
                </div>
                {message && <p className="text-center text-danger mt-3">{message}</p>}
              </MDBCardBody>
            </MDBCard>
          </MDBContainer>
        </UserInfoContext.Provider>
      );

};

export default Register;
