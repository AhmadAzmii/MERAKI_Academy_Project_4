import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import "./ProviderDashboard.css";

const ProviderDashboard = () => {
  const token = localStorage.getItem("token");
  const specialist = localStorage.getItem("specialist");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState("");
  // const [userName, setUserName] = useState("");
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
            err.response?.data?.message || "Error fetching provider information"
          );
        });
    }
  }, [token]);

  const handleAddProviderInfo = () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .post(
        "http://localhost:5000/providerInfo/",
        { title, description, availability, experience, specialist },
        { headers }
      )
      .then((result) => {
        setMessage(result.data.message);
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

  const handleUpdate = (
    postId,
    newTitle,
    newDescription,
    newExperience,
    newAvailability
  ) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .put(
        `http://localhost:5000/providerInfo/${postId}`,
        {
          availability: newAvailability,
          experience: newExperience,
          description: newDescription,
          title: newTitle,
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

  return (
    <div className="ProviderDashboard">
      <div className="Provider-Info">
        <h2 className="mb-4">Add Info</h2>
        <div className="form-group mb-3">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group mb-3">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
          ></textarea>
        </div>
        <div className="form-group mb-3">
          <label>Experience</label>
          <input
            type="text"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group mb-3">
          <label>Availability</label>
          <input
            type="text"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="form-control"
          />
        </div>
        {message && <p className="text-danger">{message}</p>}
        <button className="btn" onClick={handleAddProviderInfo}>
          Create New Provider Information
        </button>
      </div>
      <h2 className="mt-5">Provider Information</h2>
      {providerInfo?.map((info) => {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        return (
          <div key={info._id} className="card mt-3">
            <div className="card-body">
              <p className="card-text">{info.author.userName}</p>
              <p className="card-text">{info.specialist.name}</p>
              <h5 className="card-title">{info.title}</h5>
              <p className="card-text">{info.description}</p>
              <p className="card-text">Experience: {info.experience}</p>
              <p className="card-text">Availability: {info.availability}</p>
              {userId === info.author._id && (
                <div className="update-form">
                  {isUpdated ? (
                    <div>
                      <div className="form-group">
                        <label>New Title</label>
                        <input
                          type="text"
                          onChange={(e) => (info.newTitle = e.target.value)}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>New Description</label>
                        <textarea
                          onChange={(e) =>
                            (info.newDescription = e.target.value)
                          }
                          className="form-control"
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <label>New Availability</label>
                        <input
                          type="text"
                          onChange={(e) =>
                            (info.newAvailability = e.target.value)
                          }
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>New Experience</label>
                        <input
                          type="text"
                          onChange={(e) =>
                            (info.newExperience = e.target.value)
                          }
                          className="form-control"
                        />
                      </div>
                    </div>
                  ) : null}
                  <button
                    className="btn mt-3"
                    onClick={() => {
                      setIsUpdated(!isUpdated);
                      if (isUpdated) {
                        handleUpdate(
                          info._id,
                          info.newTitle,
                          info.newDescription,
                          info.newExperience,
                          info.newAvailability
                        );
                      }
                    }}
                  >
                    {isUpdated ? "Save" : "Update"}
                  </button>
                  <button
                    className="btn btn-danger mt-3"
                    onClick={() => handleDelete(info._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProviderDashboard;
