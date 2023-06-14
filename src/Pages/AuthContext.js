import React, { useState, useMemo, useEffect } from 'react';
import { getCookie } from '../constants/cookies';

const AuthContext = React.createContext({
    isLoggedIn: false,
    setIsLoggedIn: () => { },
});

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedIsLoggedIn = getCookie("isLoggedIn");
        if (storedIsLoggedIn) {
            setIsLoggedIn(JSON.parse(storedIsLoggedIn));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    }, [isLoggedIn]);

    const value = useMemo(() => {
        const updateIsLoggedIn = (value) => {
            setIsLoggedIn(value);
        };
        return { isLoggedIn, setIsLoggedIn: updateIsLoggedIn };
    }, [isLoggedIn]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
