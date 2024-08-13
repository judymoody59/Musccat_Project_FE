import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  BrowserRouter as
  Router,
  Routes,
  Route
} from "react-router-dom";
import { AuthProvider } from './component/contexts/AuthContext';
import styled from 'styled-components';

//Pages
import Login from './component/page/Login';
import Register from './component/page/Register';
import MainPage from './component/page/MainPage';
import EntireScholar from './component/page/EntireScholar';
import RecomScholar from './component/page/RecomScholar';
import Notice from './component/page/Notice';
import MyPage from './component/page/MyPage';


const MainTitleText = styled.p`
    font-size: 24px;
    font-weight: bold;
    text-align: center;

`;


function App() {

  return (
    <Router>
      <div className="flex flex-col min-h-screen overflow-hidden">
      <AuthProvider>
        <Routes>
          <Route index element={<MainPage />} />
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/register" element={<Register />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/entirescholar" element={<EntireScholar />} />
          <Route path="/recomscholar" element={<RecomScholar />} />
          <Route path="/notice" element={<Notice />} />
        </Routes>
        </AuthProvider>
        </div>
    </Router>
  );
}

export default App;
