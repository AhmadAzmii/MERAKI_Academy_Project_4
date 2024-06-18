import axios from 'axios';
import React, { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
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
                            console.log('Login Failed');
                            setMessage('Google login failed');
                            setTimeout(() => setMessage(""), 3000);
                        }}
                        isSignedIn={true}
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
                    <div className="text-end mb-3">
                        <a href="#!" className="text-decoration-none">Forgot password?</a>
                    </div>
                    <button className='btn btn-primary w-100' type="button" onClick={handleLogin}>Login</button>
                </form>
                <p className="text-center mt-3">
                    Don't have an account? <a href="#!" className="text-decoration-none" onClick={() => navigate('/register')}>Register</a>
                </p>
                {message && <p className="text-center text-danger mt-3">{message}</p>}
            </div>
        </div>
    );

}

export default Login;
