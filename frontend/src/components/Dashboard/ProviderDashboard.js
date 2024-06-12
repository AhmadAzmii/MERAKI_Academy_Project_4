import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdb-react-ui-kit';
import "./ProviderDashboard.css"

const ProviderDashboard = () => {
  const token = localStorage.getItem("token");
  const specialist = localStorage.getItem("specialist");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState("");
  const [userName, setUserName] = useState("");
  const [providerInfo, setProviderInfo] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserName(decodedToken.userName);


      axios.get(`http://localhost:5000/providerInfo/author/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((result) => {
          setProviderInfo(result.data.providersInfo);
        })
        .catch((err) => {
          console.error(err);
          setMessage(err.response?.data?.message || "Error fetching provider information");
        });
    }
  }, [token]);

  const handleAddProviderInfo = () => {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    axios.post("http://localhost:5000/providerInfo/", { title, description, availability, experience, specialist }, { headers })
      .then((result) => {
        setMessage(result.data.message);

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        axios.get(`http://localhost:5000/providerInfo/author/${userId}`, { headers })
          .then((res) => {
            setProviderInfo(res.data.providersInfo);
          })
          .catch((err) => {
            console.error(err);
            setMessage(err.response?.data?.message || "Error fetching provider information");
          });
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || "Error adding provider information");
      });
  }

  const handleUpdate = (postId, newTitle, newDescription, newExperience, newAvailability) => {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    axios.put(`http://localhost:5000/providerInfo/${postId}`, {
      availability: newAvailability,
      experience: newExperience,
      description: newDescription,
      title: newTitle
    }, { headers })
      .then((result) => {
        if (result.status === 202 && result.data.success) {
          setProviderInfo(providerInfo.map((post) =>
            post._id === postId ? { ...post, title: newTitle, description: newDescription, availability: newAvailability, experience: newExperience } : post
          ));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const handleDelete =(postId)=>{
    axios.delete(`http://localhost:5000/providerInfo/${postId}`)
    .then((result)=>{
      if(result.status === 200 && result.data.success){
        setProviderInfo(providerInfo.filter((post)=>post._id !==postId))
      }
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  return (
    <MDBContainer className='ProviderDashboard'>
      <h2 className="mb-4">Add info</h2>
      <MDBRow className="mb-3">
        <MDBCol>
          <MDBInput label='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
        </MDBCol>
        <MDBCol>
          <MDBInput label='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
        </MDBCol>
      </MDBRow>
      <MDBRow className="mb-3">
        <MDBCol>
          <MDBInput label='Experience' value={experience} onChange={(e) => setExperience(e.target.value)} />
        </MDBCol>
        <MDBCol>
          <MDBInput label='Availability' value={availability} onChange={(e) => setAvailability(e.target.value)} />
        </MDBCol>
      </MDBRow>
      {message && <p className="text-danger">{message}</p>}
      <MDBBtn onClick={handleAddProviderInfo}>Create New Provider Information</MDBBtn>

      <h2 className="mt-5">Provider Information</h2>

      {providerInfo?.map((info) => {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        return (
          <MDBCard key={info._id} className="mt-3">
            <MDBCardBody>
              <MDBCardTitle>{info.title}</MDBCardTitle>
              <MDBCardText>{info.description}</MDBCardText>
              <MDBCardText>Experience: {info.experience}</MDBCardText>
              <MDBCardText>Availability: {info.availability}</MDBCardText>
              {userId === info.author._id && (
                <div>
                  {isUpdated ? (
                    <div>
                      <MDBInput label='New Title' onChange={(e) => info.newTitle = e.target.value} />
                      <MDBInput type='textarea' label='New Description' onChange={(e) => info.newDescription = e.target.value} />
                      <MDBInput label='New Availability' onChange={(e) => info.newAvailability = e.target.value} />
                      <MDBInput label='New Experience' onChange={(e) => info.newExperience = e.target.value} />
                    </div>
                  ) : null}
                  <MDBBtn className="mt-3" onClick={() => {
                    setIsUpdated(!isUpdated);
                    if (isUpdated) {
                      handleUpdate(info._id, info.newTitle, info.newDescription, info.newExperience, info.newAvailability);
                    }
                  }}>
                    {isUpdated ? 'Save' : 'Update'}
                  </MDBBtn>
                  <MDBBtn className='mt_3' onClick={()=>handleDelete(info._id)}>
                  Delete
                  </MDBBtn>
                </div>
              )}
            </MDBCardBody>
          </MDBCard>
        );
      })}
    </MDBContainer>
  );
};

export default ProviderDashboard;
