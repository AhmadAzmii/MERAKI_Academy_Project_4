import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './Register.css'; // Import the CSS file

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
                specialist,
                age,
                isSpecialist,
            };

            try {
                const response = await axios.post("http://localhost:5000/users/register", userData);
                setMessage(response.data.message);
            } catch (error) {
                setMessage(error.response?.data?.message || "Registration failed");
            }
        };
        reader.onerror = () => {
            setMessage("Failed to read the image file");
        };
    };

    return (
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
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
