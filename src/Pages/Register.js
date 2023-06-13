import React, { useState, useContext } from 'react';
import { API_URL } from '../constants/Api';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !email || !password) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        setLoading(true);

        console.log('username:', username);
        console.log('email:', email);
        console.log('password:', password);


        try {
            const response = await fetch(`${API_URL}/api/user/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setLoading(false);

                setIsLoggedIn(true); // Update the authentication status in the context

                navigate('/login');
            } else {
                throw new Error('Registration failed');
            }

        } catch (error) {
            console.error(error);
            setLoading(false);
            setErrorMessage('Registration failed');
        }
    };

    return (
        <div>
            <h2>Register</h2>
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
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    {loading ? 'Loading...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;
