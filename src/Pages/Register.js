import React, { useState, useContext } from 'react';
import { API_URL } from '../constants/Api';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from './AuthContext';

import { Card, Input, Button, Typography } from '@material-tailwind/react';
import styles from './register.module.css'
import illustration from '../assets/illustration.svg';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !email || !password) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long');
            return;
        }

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
                setIsLoggedIn(true);
                navigate('/login');
                window.location.reload(true);
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Registration failed');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.illustrationContainer}>
                <img src={illustration} alt="Illustration" />
            </div>
            <Card shadow={false} className={styles.card}>
                <Typography variant="h4" color="blue-gray">
                    Sign Up
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                    Enter your details to register.
                </Typography>
                <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
                    <div className="mb-4 flex flex-col gap-6">
                        <Input
                            size="lg"
                            label="Name"
                            value={username}
                            color='brown'
                            onChange={(e) => setUsername(e.target.value)}
                            />
                        <Input
                            size="lg"
                            label="Email"
                            value={email}
                            color='brown'
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        <Input
                            type="password"
                            size="lg"
                            label="Password"
                            value={password}
                            color='brown'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {errorMessage && <Typography color="red">{errorMessage}</Typography>}
                    <Button color='brown' type="submit" className="mt-6" fullWidth>
                        Register
                    </Button>
                    <Typography color="gray" className="mt-4 text-center font-normal">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-brown-500 transition-colors hover:text-brown-700"
                        >
                            Sign In
                        </Link>
                    </Typography>
                </form>
            </Card>
        </div>
    );
};

export default Register;
