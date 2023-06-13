import React, { useState, useContext } from 'react';
import { API_URL } from '../constants/Api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AuthContext from './AuthContext';

import { Card, Input, Button, Typography } from '@material-tailwind/react';
import styles from './login.module.css'
import illustration from '../assets/illustration.svg';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setErrorMessage('Please enter your username and password');
            return;
        }

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

                setIsLoggedIn(true);

                navigate('/');
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Login failed');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.illustrationContainer}>
                <img src={illustration} alt="Illustration" />
            </div>
            <Card shadow={false} className={styles.card}>
                <Typography variant="h4" color="blue-gray">
                    Sign In
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                    Enter your details to log in.
                </Typography>
                <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
                    <div className="mb-4 flex flex-col gap-6">
                        <Input
                            size="lg"
                            label="Name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input
                            type="password"
                            size="lg"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {errorMessage && <Typography color="red">{errorMessage}</Typography>}
                    <Button type="submit" className="mt-6" fullWidth>
                        Sign In
                    </Button>
                    <Typography color="gray" className="mt-4 text-center font-normal">
                        Do not have an account?{' '}
                        <Link
                            to="/register"
                            className="font-medium text-blue-500 transition-colors hover:text-blue-700"
                        >
                            Sign Up
                        </Link>
                    </Typography>
                </form>
            </Card>
        </div>
    );
};

export default Login;
