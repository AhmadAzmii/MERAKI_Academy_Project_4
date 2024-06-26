import axios from 'axios';
import React, { useState, useEffect, createContext } from 'react';
import './Register.css';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBBtn
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

export const UserInfoContext = createContext();

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");
  const [isSpecialist, setIsSpecialist] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

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

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      userName,
      age,
      specialist: isSpecialist ? specialist : null
    };

    try {
      const response = await axios.post("http://localhost:5000/users/register", userData);
      setMessage(response.data.message);
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <UserInfoContext.Provider value={{ userName, setUserName }}>
      <MDBContainer fluid className="p-4 register-container">
        <MDBCard className="text-black">
          <MDBCardBody className="p-md-5">
            <h3 className="text-center">Sign up</h3>
            <div className="register-form">
              <div>
              <div className="form-left">
                <MDBInput label="First Name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <MDBInput label="Last Name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <MDBInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <MDBInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <MDBInput label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <MDBInput label="Phone Number" type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                <MDBInput label="User Name" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
                <MDBInput label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
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

            
              </div>
              <div>
            <div>
                <MDBBtn className="w-100 mt-3" onClick={handleSubmit}>Register</MDBBtn>
                </div>
                <div className="text-center mt-3">
                  <p>
                    Already have an account? <a href="#!" className="text-decoration-none" onClick={() => navigate('/login')}>Login</a>
                  </p>
                </div>
                
               </div>
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
    </UserInfoContext.Provider>
  );
};

export default Register;
