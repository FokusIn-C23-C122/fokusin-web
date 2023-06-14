import './index.css';
import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import Home from './Pages/Home';
import AboutUs from './Pages/AboutUs';
import UserManual from './Pages/UserManual';
import Analysis from './Pages/Analysis';
import History from './Pages/History';
import Recording from './Pages/Recording';
import Statistic from './Pages/Statistic';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Logout from './Pages/Logout';
import AuthContext, { AuthProvider } from './Pages/AuthContext';

export default function App() {
  const { isLoggedIn } = useContext(AuthContext);
  console.log('isLoggedIn:', isLoggedIn);

  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/#aboutus" element={<AboutUs />} />
      <Route path="/#usermanual" element={<UserManual />} />
      {!isLoggedIn && (
        <>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </>
      )}
      {isLoggedIn && (
        <>
          <Route path="/logout" element={<Logout />} />
          <Route path="/analysis" element={<Statistic />} />
          <Route path="/history" element={<History />} />
          <Route path="/recording" element={<Recording />} />
          <Route path="/statistic" element={<Analysis />} />
        </>
      )}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
