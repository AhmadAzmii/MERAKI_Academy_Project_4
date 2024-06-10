import axios from 'axios';
import React, { useState } from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBRow,
    MDBCol,
    MDBInput,
    MDBCheckbox
} from 'mdb-react-ui-kit';

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
                const response = await axios.post("http://localhost:5000/users/register", userData, {
                    
                });
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
        <MDBContainer fluid>
            <MDBRow className="justify-content-center mt-5">
                <MDBCol lg='8'>
                    <MDBCard className='my-5 rounded-3' style={{ maxWidth: '600px' }}>
                        <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img3.webp' className='w-100 rounded-top' alt="Sample photo" />
                        <MDBCardBody className='px-5'>
                            <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">Registration</h3>
                            <MDBInput wrapperClass='mb-4' label='First Name' id='firstName' type='text' onChange={(e) => setFirstName(e.target.value)} />
                            <MDBInput wrapperClass='mb-4' label='Last Name' id='lastName' type='text' onChange={(e) => setLastName(e.target.value)} />
                            <MDBInput wrapperClass='mb-4' label='Age' id='age' type='number' onChange={(e) => setAge(e.target.value)} />
                            <MDBInput wrapperClass='mb-4' label='Phone Number' id='phoneNumber' type='text' onChange={(e) => setPhoneNumber(e.target.value)} />
                            <MDBInput wrapperClass='mb-4' label='User Name' id='userName' type='text' onChange={(e) => setUserName(e.target.value)} />
                            <MDBCheckbox label='Are you a specialist?' id='specialist' onChange={(e) => setIsSpecialist(e.target.checked)} />
                            <MDBInput wrapperClass='mb-4' label='Email' id='email' type='email' onChange={(e) => setEmail(e.target.value)} />
                            <MDBInput wrapperClass='mb-4' label='Password' id='password' type='password' onChange={(e) => setPassword(e.target.value)} />
                            <MDBInput wrapperClass='mb-4' label='Image' id='image' type='file' onChange={handleFileChange} />
                            <MDBBtn color='primary' className='mb-4' size='lg' onClick={handleSubmit}>Register</MDBBtn>
                            {message && <p>{message}</p>}
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
};

export default Register;
