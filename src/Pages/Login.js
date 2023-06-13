    import React, { useState, useContext } from 'react';
    import { API_URL } from '../constants/Api';
    import { useNavigate } from 'react-router-dom';
    import AuthContext from './AuthContext';

    const Login = () => {
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const [errorMessage, setErrorMessage] = useState('');
        const [loading, setLoading] = useState(false);
        const navigate = useNavigate();
        const { setIsLoggedIn } = useContext(AuthContext);

        const handleSubmit = async (e) => {
            e.preventDefault();

            if (!username || !password) {
                setErrorMessage('Please enter your username and password');
                return;
            }

            setLoading(true);

            try {
                const response = await fetch(`${API_URL}/api/user/login/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setLoading(false);

                    setIsLoggedIn(true); 

                    navigate('/');
                } else {
                    throw new Error('Login failed');
                }
            } catch (error) {
                console.error(error);
                setLoading(false);
                setErrorMessage('Login failed');
            }
        };

        return (
            <div>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {errorMessage && <p>{errorMessage}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </form>
            </div>
        );
    };

    export default Login;
