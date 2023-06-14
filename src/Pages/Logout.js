import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeCookie, setCookie } from '../constants/cookies';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();

    removeCookie("username");
    removeCookie("access");
    removeCookie("refresh");
    setCookie("isLoggedIn", false)

    navigate('/');
  }, [navigate]);

  return null;
}
