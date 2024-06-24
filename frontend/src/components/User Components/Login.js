import React, { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';

const clientId = "562371595229-m3ggl0fnth8ngobannl8lpc1461bnmoc.apps.googleusercontent.com";

function Login() {
    const { setToken, setIsLoggedIn, setIsAdmin, setIsProvider, setIsLoggedInWithGoogle, setUserName, setImage ,isProvider} = useContext(UserContext);
    const [email, setEmail] = useState('');
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
    
            setUserName(decodedToken.user);
            setImage(decodedToken.image);
    
            if (role === 'serviceProvider') {
                if (specialistId) {
                    localStorage.setItem('specialist', specialistId);
                }
                setIsAdmin(false);
                setIsProvider(true);
                navigate('/Provider-Dashboard');
            } else if (role === 'Admin') {
                
                setIsAdmin(true);
                setIsProvider(false);
                navigate('/admin-dashboard');
            } else {
                setIsAdmin(false);
                setIsProvider(false);
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Client-side error during login process:", err);
            setMessage(err.response?.data?.message || 'Login failed');
            setTimeout(() => setMessage(""), 3000);
        }
    };
    console.log(isProvider);
    

    const handleGoogleLoginSuccess = async (res) => {
        try {
            const googleToken = res.tokenId;
            const result = await axios.post('http://localhost:5000/users/google-login', { token: googleToken });
            const token = result.data.token;
            const decodedToken = jwtDecode(token);

            setToken(token);
            localStorage.setItem('token', token);
            setIsLoggedIn(true);
            setIsLoggedInWithGoogle(true);
            setUserName(decodedToken.user);
            setImage(decodedToken.image);

            const role = decodedToken.role.role;
            const specialistId = decodedToken.specialist?._id;

            if (role === 'serviceProvider') {
                if (specialistId) {
                    localStorage.setItem('specialist', specialistId);
                }
                setIsAdmin(false);
                setIsProvider(true);
                navigate('/Provider-Dashboard');
            } else if (role === 'Admin') {
                setIsAdmin(true);
                setIsProvider(false);
                navigate('/admin-dashboard');
            } else {
                setIsAdmin(false);
                setIsProvider(false);
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || 'Google login failed');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="text-center mb-4">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" alt="Sample" className="img-fluid" />
                </div>
                <h2 className="text-center mb-3">Sign in with</h2>
                <div className="d-flex justify-content-center mb-3">
                    <GoogleLogin
                        clientId={clientId}
                        cookiePolicy={'single_host_origin'}
                        onSuccess={handleGoogleLoginSuccess}
                        onFailure={() => {
                            console.log('Google login failed');
                            setMessage('Google login failed');
                            setTimeout(() => setMessage(''), 3000);
                        }}
                        isSignedIn={true}
                        prompt="select_account"
                        className="btn btn-outline-primary w-100"
                    />
                </div>
                <div className="d-flex align-items-center mb-4">
                    <hr className="flex-grow-1" />
                    <span className="px-2">Or</span>
                    <hr className="flex-grow-1" />
                </div>
                <form>
                    <div className="form-group mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {message && <div className="alert alert-danger mt-3">{message}</div>}
                    <p className="text-end mb-3">
                        <a href="#!" className="text-decoration-none" onClick={() => navigate('/forgot-password')}>Forgot password?</a>
                    </p>

                    <button type="button" className="btn btn-primary w-100" onClick={handleLogin}>Sign In</button>
                    <p className="text-center mt-3">
                        Don't have an account? <a href="#!" className="text-decoration-none" onClick={() => navigate('/register')}>Register</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
