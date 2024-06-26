
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBInput,
    MDBTextArea,
    MDBBtn,
    MDBCardSubTitle,
} from "mdb-react-ui-kit";
import "./CreatePost.css"
const CreatePost = () => {
    const [image, setImage] = useState(null);
    const token = localStorage.getItem("token");
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [experience, setExperience] = useState("");
    const [availability, setAvailability] = useState("");
    const specialist = localStorage.getItem("specialist");

    const [providerInfo, setProviderInfo] = useState([]);

    const handleAddProviderInfo = async () => {
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        let imageUrl = null;
        if (image) {
            try {
                imageUrl = await uploadImageToCloudinary(image);
            } catch (error) {
                console.error("Error uploading image:", error);
                setMessage("Error uploading image");
                return;
            }
        }

        axios
            .post(
                "http://localhost:5000/providerInfo/",
                {
                    title,
                    description,
                    availability,
                    experience,
                    specialist,
                    image: imageUrl,
                },
                { headers }
            )
            .then((result) => {
                setMessage(result.data.message);
                setAvailability("");
                setExperience("");
                setDescription("");
                setTitle("");
                setImage(null);
                setTimeout(() => setMessage(""), 3000);
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.userId;
                axios
                    .get(`http://localhost:5000/providerInfo/author/${userId}`, {
                        headers,
                    })
                    .then((res) => {
                        setProviderInfo(res.data.providersInfo);
                    })
                    .catch((err) => {
                        console.error(err);
                        setMessage(
                            err.response?.data?.message ||
                            "Error fetching provider information"
                        );
                        setTimeout(() => setMessage(""), 3000);
                    });
            })
            .catch((err) => {
                setMessage(
                    err.response?.data?.message || "Error adding provider information"
                );
                setTimeout(() => setMessage(""), 3000);
            });
    };
    const uploadImageToCloudinary = async (imageFile) => {
        const data = new FormData();
        data.append("file", imageFile);
        data.append("upload_preset", "rgtsukxl");
        data.append("cloud_name", "dqefjpmuo");

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/dqefjpmuo/image/upload",
            {
                method: "post",
                body: data,
            }
        );
        const result = await response.json();
        return result.url;
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };
    return (
        <div className='CreatePost'>
            <MDBRow className="add-info">


                <MDBCol md="6">

                    <h2 className="mb-4">Add Info</h2>
                    <div className="form-group mb-3">
                        <label>Title</label>
                        <MDBInput
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Description</label>
                        <MDBTextArea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Experience</label>
                        <MDBInput
                            type="text"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Availability</label>
                        <MDBInput
                            type="text"
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-control"
                        />
                    </div>
                    {message && <div className="alert alert-danger">{message}</div>}
                    <MDBBtn onClick={handleAddProviderInfo}>
                        Create New Provider Information
                    </MDBBtn>
                </MDBCol>
            </MDBRow>
        </div>
    )
};

export default CreatePost
