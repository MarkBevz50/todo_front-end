import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
// import SignIn from './pages/SignIn'; // Assuming you will create this later
import './App.css';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      {/* <Route path="/signin" element={<SignIn />} /> */}
      {/* Add other routes here */}
    </Routes>
  );
};

export default App;
