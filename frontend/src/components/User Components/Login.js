import axios from 'axios';
import React, { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import './Login.css';

function Login() {
    const { setToken, setIsLoggedIn, setIsAdmin } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [specialist, setSpecialist] = useState("");
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const result = await axios.post('http://localhost:5000/users/login', { email, password });
            setToken(result.data.token);
            localStorage.setItem('token', result.data.token);

            setIsLoggedIn(true);

            const decodedToken = jwtDecode(result.data.token);
            const role = decodedToken.role.role;
            const specialistId = decodedToken.specialist?._id;
            setSpecialist(role);

            if (role === 'serviceProvider') {
                if (specialistId) {
                    localStorage.setItem('specialist', specialistId);
                }
                setIsAdmin(false);
                navigate('/Provider-Dashboard');
            } else if (role === 'Admin') {
                setIsAdmin(true);
                navigate('/admin-dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <section className="vh-100">
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                        <form>
                        <div className="col-md-9 col-lg-6 col-xl-5">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                            className="img-fluid" alt="Sample image" />
                    </div>
                            <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                                <p className="lead fw-normal mb-0 me-3">Sign in with</p>
                                <button type="button" className="btn btn-primary btn-floating mx-1">
                                    <i className="fab fa-google"></i>
                                </button>
                            </div>
                            <div className="divider d-flex align-items-center my-4">
                                <p className="text-center fw-bold mx-3 mb-0">Or</p>
                            </div>
                            <div className="form-outline mb-4">
                                <input type="email" id="form3Example3" className="form-control form-control-lg"
                                    placeholder="Enter a valid email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <label className="form-label" htmlFor="form3Example3">Email address</label>
                            </div>
                            <div className="form-outline mb-3">
                                <input type="password" id="form3Example4" className="form-control form-control-lg"
                                    placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <label className="form-label" htmlFor="form3Example4">Password</label>
                            </div>
                                <div className="d-flex justify-content-between align-items-center">
                                   
                                    <a href="#!" className="text-body">Forgot password?</a>
                                </div>
                            <div className="text-center text-lg-start mt-4 pt-2">
                                <button type="button" className="btn btn-primary btn-lg" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} onClick={handleLogin}>
                                    Login
                                </button>
                                <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <a href="#!"
                                    className="link-danger" onClick={() => {
                                        navigate('/register')
                                    }}>Register</a></p>
                            </div>
                            
                            {message && <p className="text-danger mt-3">{message}</p>}
                            <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
                <div className="text-white mb-3 mb-md-0">
                    Copyright © 2020. All rights reserved.
                </div>
               
            </div>
                        </form>
                    </div>
                </div>
            </div>
           
        </section>
    );
}

export default Login;
