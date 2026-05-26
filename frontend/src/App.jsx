import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Import Services
import { apiService } from './services/api';

// Import Components
import PageLayout from './components/PageLayout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import Pages
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Gaming from './pages/Gaming';
import About from './pages/About';
import Login from './pages/Login';
import Admin, { ProtectedRoute } from './pages/Admin';

export default function App() {
  const [apiStatus, setApiStatus] = useState('offline');

  // Backend Health Check
  useEffect(() => {
    const checkAPI = async () => {
      try {
        const data = await apiService.ping();
        if (data.message === 'pong') setApiStatus('online');
      } catch {
        setApiStatus('offline');
      }
    };
    checkAPI();
    const interval = setInterval(checkAPI, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <PageLayout>
          <Navbar apiStatus={apiStatus} />

          <main>
            <Routes>
              <Route path="/" element={<Home apiStatus={apiStatus} />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gaming" element={<Gaming />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>

          <Footer />
        </PageLayout>
      </Router>
    </HelmetProvider>
  );
}