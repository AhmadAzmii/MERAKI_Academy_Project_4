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
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProviderDashboard.css";
import StarRating from "./StarRating";

export const providerInfoContext = createContext();

const ProviderDashboard = () => {
  const token = localStorage.getItem("token");
  const specialist = localStorage.getItem("specialist");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState("");
  const [image, setImage] = useState(null); // State to hold the image file
  const [providerInfo, setProviderInfo] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      axios
        .get(`http://localhost:5000/providerInfo/author/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((result) => {
          setProviderInfo(result.data.providersInfo);
        })
        .catch((err) => {
          console.error(err);
          setMessage(
            err.response?.data?.message ||
              "Error fetching provider information"
          );
        });
    }
  }, [token]);

  const handleAddProviderInfo = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Upload image to Cloudinary if image state is set
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
          image: imageUrl, // Include image URL in the data
        },
        { headers }
      )
      .then((result) => {
        setMessage(result.data.message);
        setAvailability("");
        setExperience("");
        setDescription("");
        setTitle("");
        setImage(null); // Reset image state after upload
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

  const handleUpdate = async (
    postId,
    newTitle,
    newDescription,
    newExperience,
    newAvailability,
    newImage // Include newImage parameter for updating image
  ) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Upload new image to Cloudinary if newImage state is set
    let imageUrl = null;
    if (newImage) {
      try {
        imageUrl = await uploadImageToCloudinary(newImage);
      } catch (error) {
        console.error("Error uploading image:", error);
        setMessage("Error uploading image");
        return;
      }
    }

    axios
      .put(
        `http://localhost:5000/providerInfo/${postId}`,
        {
          availability: newAvailability,
          experience: newExperience,
          description: newDescription,
          title: newTitle,
          image: imageUrl, // Include updated image URL in the data
        },
        { headers }
      )
      .then((result) => {
        setProviderInfo(
          providerInfo.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  title: newTitle,
                  description: newDescription,
                  availability: newAvailability,
                  experience: newExperience,
                  image: imageUrl, // Update image in the post object
                }
              : post
          )
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDelete = (postId) => {
    axios
      .delete(`http://localhost:5000/providerInfo/${postId}`)
      .then((result) => {
        if (result.status === 200 && result.data.success) {
          setProviderInfo(providerInfo.filter((post) => post._id !== postId));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // Function to upload image to Cloudinary
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

  return (
    <providerInfoContext.Provider value={{ providerInfo }}>
      <MDBContainer className="ProviderDashboard">
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
            {/* Image Upload Input */}
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

        <h2 className="mt-5">Provider Information</h2>
        <MDBRow>
          {providerInfo?.map((info) => {
            const firstLetter = info.author.userName.charAt(0).toUpperCase();
            const defaultImagePath = require(`../../alphabetImages/${firstLetter}.png`);
            const userImage = info.author.image || defaultImagePath;

            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            return (
              <MDBCol md="6" key={info._id} className="mt-3">
                <MDBCard>
                  <MDBCardBody>
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={userImage}
                        alt={info.author.userName}
                        className="author-image rounded-circle me-3"
                      />
                      <MDBCardTitle className="text-center mb-0">
                        {info.author.userName}
                      </MDBCardTitle>
                    </div>
                    <MDBCardSubTitle className="text-center text-muted">
                      <b>{info?.specialist?.name}</b>
                    </MDBCardSubTitle>

                    <MDBCardTitle>
                      <b>Title: </b>
                      {info.title}
                    </MDBCardTitle>
                    <MDBCardText>
                      <b>Description: </b> {info.description}
                    </MDBCardText>
                    <p>
                      <b>Experience: </b> {info.experience}
                    </p>
                    <p>
                      <b>Availability: </b>: {info.availability}
                    </p>

                    {/* Render Image */}
                    {info.image && (
                      <div className="post-image-container">
                        <img
                          src={info.image}
                          alt="Provider Post"
                          className="post-image"
                        />
                      </div>
                    )}

                    {info.reviews?.length > 0 && (
                      <div className="reviews-section">
                        <h4>Reviews:</h4>
                        {info.reviews.map((review, i) => (
                          <MDBCard key={i} className="mb-3">
                            <MDBCardBody>
                              <div className="d-flex align-items-center mb-3">
                                <img
                                  src={
                                    review.customer.image ||
                                    require(`../../alphabetImages/${review.customer.userName.charAt(0).toUpperCase()}.png`)
                                  }
                                  alt={review.customer.userName}
                                  className="author-image rounded-circle me-3"
                                />
                                <div>
                                  <MDBCardTitle className="text-center mb-0">
                                    {review.customer.userName}
                                  </MDBCardTitle>
                                </div>
                              </div>
                              <MDBCardText>{review.review}</MDBCardText>
                              <StarRating rating={review.rating} />
                            </MDBCardBody>
                          </MDBCard>
                        ))}
                      </div>
                    )}

                    {/* Update Form with Image Upload */}
                    {userId === info.author._id && (
                      <div className="update-form">
                        {isUpdated ? (
                          <div>
                            <div className="form-group">
                              <label>New Title</label>
                              <MDBInput
                                type="text"
                                onChange={(e) => (info.newTitle = e.target.value)}
                                className="form-control"
                              />
                            </div>
                            <div className="form-group">
                              <label>New Description</label>
                              <MDBTextArea
                                onChange={(e) =>
                                  (info.newDescription = e.target.value)
                                }
                                className="form-control"
                              />
                            </div>
                            <div className="form-group">
                              <label>New Availability</label>
                              <MDBInput
                                type="text"
                                onChange={(e) =>
                                  (info.newAvailability = e.target.value)
                                }
                                className="form-control"
                              />
                            </div>
                            <div className="form-group">
                              <label>New Experience</label>
                              <MDBInput
                                type="text"
                                onChange={(e) =>
                                  (info.newExperience = e.target.value)
                                }
                                className="form-control"
                              />
                            </div>
                            {/* New Image Upload Input */}
                            <div className="form-group mb-3">
                              <label>New Image</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  (info.newImage = e.target.files[0])
                                }
                                className="form-control"
                              />
                            </div>
                          </div>
                        ) : null}
                        <MDBBtn
                          className="mt-3"
                          onClick={() => {
                            setIsUpdated(!isUpdated);
                            if (isUpdated) {
                              handleUpdate(
                                info._id,
                                info.newTitle,
                                info.newDescription,
                                info.newExperience,
                                info.newAvailability,
                                info.newImage // Pass newImage to handleUpdate
                              );
                            }
                          }}
                        >
                          {isUpdated ? "Save" : "Update"}
                        </MDBBtn>
                        <MDBBtn
                          className="btn-danger mt-3"
                          onClick={() => handleDelete(info._id)}
                        >
                          Delete
                        </MDBBtn>
                      </div>
                    )}
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            );
          })}
        </MDBRow>
      </MDBContainer>
    </providerInfoContext.Provider>
  );
};

export default ProviderDashboard;
