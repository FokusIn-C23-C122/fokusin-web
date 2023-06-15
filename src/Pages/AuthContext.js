import React, { useState, useMemo, useEffect, createContext } from 'react';
import { getCookie, setCookie } from '../constants/cookies';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!getCookie('access'));

    useEffect(() => {
        const storedIsLoggedIn = getCookie('isLoggedIn');
        if (storedIsLoggedIn) {
            setIsLoggedIn(JSON.parse(storedIsLoggedIn));
        }
    }, []);

    const updateIsLoggedIn = (value) => {
        setIsLoggedIn(value);
        setCookie('isLoggedIn', value);
    };

    const value = useMemo(() => {
        return { isLoggedIn, setIsLoggedIn: updateIsLoggedIn };
    }, [isLoggedIn]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
