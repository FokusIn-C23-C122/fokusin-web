import './index.css';
import React, { } from 'react';
import ReactDOM from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Home from './Pages/Home';
import AboutUs from './Pages/AboutUs';
import UserManual from './Pages/UserManual';
import Analysis from './Pages/Analysis';
import History from './Pages/History';
import Recording from './Pages/Recording';

export default function App() {
  return (
    <>
      <Routes>
        <>
          <Route path='/' element={<Home />}></Route>
          <Route path="/#aboutus" element={<AboutUs />} />
          <Route path="/#usermanual" element={<UserManual />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/history" element={<History />} />
          <Route path="/recording" element={<Recording />} />
        </>
      </Routes>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
