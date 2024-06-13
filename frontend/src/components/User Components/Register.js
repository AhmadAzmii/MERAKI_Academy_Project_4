import axios from 'axios';
import React, { useState, useEffect, createContext } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
export const UserInfoContext=createContext()
const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [image, setImage] = useState(null);
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

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phoneNumber', phoneNumber);
        formData.append('userName', userName);
        formData.append('age', age);
        formData.append('specialist', isSpecialist ? specialist : '');
        formData.append('image', image);

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/breellz/image/upload", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            
            const imageUrl = data.url;

            const userData = {
                firstName,
                lastName,
                email,
                password,
                phoneNumber,
                userName,
                age,
                image: imageUrl,
                specialist: isSpecialist ? specialist : null,
            };

            const registerResponse = await axios.post("http://localhost:5000/users/register", userData);
            setMessage(registerResponse.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <UserInfoContext.Provider value={{image, setImage,
            userName, setUserName}}>
        <div className="register-container">
            <h3>Registration</h3>
            <div>
                <label>First Name</label>
                <input type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
                <label>Last Name</label>
                <input type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div>
                <label>Age</label>
                <input type='number' value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div>
                <label>Phone Number</label>
                <input type='text' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <div>
                <label>User Name</label>
                <input type='text' value={userName} onChange={(e) => setUserName(e.target.value)} />
            </div>
            <div>
                <label>
                    <input type='checkbox' checked={isSpecialist} onChange={(e) => setIsSpecialist(e.target.checked)} />
                    Are you a specialist?
                </label>
            </div>
            {isSpecialist && (
                <div>
                    <label>Specialty</label>
                    <select value={specialist} onChange={(e) => setSpecialist(e.target.value)}>
                        <option value="">Select a specialty</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>
            )}
            <div>
                <label>Email</label>
                <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label>Password</label>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
                <label>Image</label>
                <input type='file' onChange={handleFileChange} />
            </div>
            
            <div>
                <button onClick={handleSubmit}>Register</button>
            </div>
            <h3>Already have an account? <a href="#!"
                                    className="link-danger" onClick={() => {
                                        navigate('/login')
                                    }}>Login</a></h3>
            {message && <p>{message}</p>}
        </div>
        </UserInfoContext.Provider>
    );
};

export default Register;
