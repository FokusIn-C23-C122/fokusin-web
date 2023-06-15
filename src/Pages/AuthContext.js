import React, { useState, useMemo, useEffect, createContext } from 'react';
import { getCookie, setCookie } from '../constants/cookies';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!getCookie('access'));
    const [userName, setUserName] = useState('');
    useEffect(() => {
        const storedIsLoggedIn = getCookie('isLoggedIn');
        if (storedIsLoggedIn) {
            setIsLoggedIn(JSON.parse(storedIsLoggedIn));
        }
        const storedUserName = getCookie('username');
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []);

    const updateIsLoggedIn = (value, username) => {
        setIsLoggedIn(value);
        setCookie('isLoggedIn', value);
        setUserName(username);
        setCookie('username', username);
    };

    const value = useMemo(() => {
        return { isLoggedIn, setIsLoggedIn: updateIsLoggedIn, userName, setUserName };
    }, [isLoggedIn, userName]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
