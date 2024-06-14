import axios from 'axios';
import React, { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Corrected import
import { GoogleLogin } from 'react-google-login';

const clientId = "562371595229-m3ggl0fnth8ngobannl8lpc1461bnmoc.apps.googleusercontent.com";

function Login() {
    const { setToken, setIsLoggedIn, setIsAdmin, setIsProvider, setIsLoggedInWithGoogle } = useContext(UserContext);
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
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const handleGoogleLoginSuccess = async (res) => {
        try {
            const googleToken = res.tokenId;
            const result = await axios.post('http://localhost:5000/users/google-login', { token: googleToken });
            setToken(result.data.token);
            
            localStorage.setItem('token', result.data.token);

            setIsLoggedIn(true);
            setIsLoggedInWithGoogle(true)
            const decodedToken = jwtDecode(result.data.token);
            const role = decodedToken.role.role;
            const specialistId = decodedToken.specialist?._id;
            console.log(decodedToken);
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
            setMessage(err.response?.data?.message || 'google login failed');
            setTimeout(() => setMessage(""), 3000);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-image">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" alt="Sample" />
                </div>
                <div className="login-form">
                    <h2>Sign in with</h2>
                    <div className="social-login-buttons">
                        <GoogleLogin
                            clientId={clientId}
                            cookiePolicy={'single_host_origin'}
                            onSuccess={handleGoogleLoginSuccess}
                            onFailure={() => {
                                console.log('Login Failed');
                                setMessage('Google login failed');
                                setTimeout(() => setMessage(""), 3000);
                            }}
                            isSignedIn={true}
                        />
                    </div>
                    <div className="divider">Or</div>
                    <form>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="forgot-password">
                            <a href="#!">Forgot password?</a>
                        </div>
                        <button className='login-button' type="button" onClick={handleLogin}>Login</button>
                        <p className="register-link">
                            Don't have an account? <a href="#!" onClick={() => navigate('/register')}>Register</a>
                        </p>
                    </form>
                    {message && <p className="error-message">{message}</p>}
                </div>
            </div>
        </div>
    );
}

export default Login;
