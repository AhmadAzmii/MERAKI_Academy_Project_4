import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
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
import Message from './Message';
import socketInit from '../../socket.server';
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProviderDashboard.css";
import StarRating from "./StarRating";
import io from 'socket.io-client';
export const providerInfoContext = createContext();

const ProviderDashboard = () => {
  const token = localStorage.getItem("token");
  const specialist = localStorage.getItem("specialist");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState("");
  const [image, setImage] = useState(null);
  const [providerInfo, setProviderInfo] = useState([]);
  const [isUpdated, setIsUpdated] = useState({});
  const [user_id, setUser_id] = useState("");
  const [editStates, setEditStates] = useState({});
  const [allMessages, setAllMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [providerId, setProviderId] = useState('');
  const [providerUserName, setProviderUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [messageFrom, setMessageFrom] = useState("")
   const newSocket = io('http://localhost:8080', {
    extraHeaders: {
      tokenone: token,
      user_id: providerId,
    },
  });
  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setProviderId(decodedToken.userId);
      setProviderUserName(decodedToken.user);
    }
  }, [token]);

  useEffect(() => {
    newSocket.on('message', (data) => {
      setAllMessages((prevMessages) => [...prevMessages, data]);
      setMessageFrom(data.from);
    });
console.log(messageFrom);
    return () => {
      newSocket.off('message');
    };
  }, [newSocket]);
  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
setUserId(userId)
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

  const handleUpdate = async (postId) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const { newTitle, newDescription, newExperience, newAvailability, newImage } = editStates[postId] || {};

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
          image: imageUrl,
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
                  image: imageUrl,
                }
              : post
          )
        );
        setIsUpdated((prev) => ({ ...prev, [postId]: false }));
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

  const handleEditImageChange = (postId, e) => {
    const file = e.target.files[0];
    setEditStates((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        newImage: file,
      },
    }));
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
  useEffect(() => {
    socket?.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to socket");
    });

    socket?.on("connect_error", (error) => {
      setIsConnected(false);
      console.log(error);
    });

    return () => {
      setIsConnected(false);
      socket?.close();
      socket?.removeAllListeners();
    };
  }, [socket]);


  return (
    <providerInfoContext.Provider value={{ providerInfo }}>
      <MDBContainer className="ProviderDashboard">
        <MDBRow className="add-info">
   

          <MDBCol md="6">
          <input
        type="text"
        placeholder="user id"
        value={userId}
      />
      <input
        type="text"
        placeholder="token"
        value={token}
      />
      <button onClick={() => setSocket(socketInit({ user_id, token }))}>
        Connect
      </button>
   
      {isConnected && <Message socket={socket} userId={messageFrom} />}
                 <div className='messages'>
        {allMessages.map((msg, index) => (
          <p key={index} className={msg.from === providerUserName ? 'from-me' : 'from-other'}>
            {console.log(msg.from)}
            <small>{msg.from}: {msg.message}</small>
          </p>
        ))}
      </div>
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

        <h2 className="mt-5">Provider Information</h2>
        <MDBRow>
          {providerInfo?.map((info) => {
            const firstLetter = info.author.userName.charAt(0).toUpperCase();
            const defaultImagePath = require(`../../alphabetImages/${firstLetter}.png`);
            const userImage = info.author.image || defaultImagePath;

            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;

            const isCurrentPostUpdated = isUpdated[info._id] || false;

            const handleInputChange = (postId, field, value) => {
              setEditStates((prev) => ({
                ...prev,
                [postId]: {
                  ...prev[postId],
                  [field]: value,
                },
              }));
            };

            return (
              <MDBCol md="6" key={info._id} className="mb-4">
                <MDBCard className="provider-card">
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

                    {userId === info.author._id && (
                      <div className="update-form">
                        {isCurrentPostUpdated ? (
                          <div>
                            <div className="form-group">
                              <label>New Title</label>
                              <MDBInput
                                type="text"
                                value={editStates[info._id]?.newTitle || title}
                                onChange={(e) =>
                                  handleInputChange(
                                    info._id,
                                    "newTitle",
                                    e.target.value
                                  )
                                }
                                className="form-control"
                              />
                            </div>
                            <div className="form-group">
                              <label>New Description</label>
                              <MDBTextArea
                                value={
                                  editStates[info._id]?.newDescription ||description
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    info._id,
                                    "newDescription",
                                    e.target.value
                                  )
                                }
                                className="form-control"
                              />
                            </div>
                            <div className="form-group">
                              <label>New Availability</label>
                              <MDBInput
                                type="text"
                                value={
                                  editStates[info._id]?.newAvailability || availability
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    info._id,
                                    "newAvailability",
                                    e.target.value
                                  )
                                }
                                className="form-control"
                              />
                            </div>
                            <div className="form-group">
                              <label>New Experience</label>
                              <MDBInput
                                type="text"
                                value={editStates[info._id]?.newExperience || experience}
                                onChange={(e) =>
                                  handleInputChange(
                                    info._id,
                                    "newExperience",
                                    e.target.value
                                  )
                                }
                                className="form-control"
                              />
                            </div>
                            <div className="form-group mb-3">
                              <label>New Image</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleEditImageChange(info._id, e)
                                }
                                className="form-control"
                              />
                            </div>
                          </div>
                        ) : null}
                        <MDBBtn
                          className="mt-3"
                          onClick={() => {
                            setIsUpdated((prev) => ({
                              ...prev,
                              [info._id]: !isCurrentPostUpdated,
                            }));
                            if (isCurrentPostUpdated) {
                              handleUpdate(info._id);
                            }
                          }}
                        >
                          {isCurrentPostUpdated ? "Save" : "Update"}
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
