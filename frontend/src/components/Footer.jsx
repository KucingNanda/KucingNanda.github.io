import React, { useState, useEffect } from 'react';
import { FaTwitter, FaInstagram, FaGithub, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Lock, Settings } from 'lucide-react';
import { apiService } from '../services/api';

const Footer = () => {
  const [socials, setSocials] = useState({});

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const data = await apiService.getProfile();
        let profileData = null;
        if (Array.isArray(data) && data.length > 0) {
          profileData = data[0];
        } else if (data && !Array.isArray(data)) {
          profileData = data;
        }

        if (profileData && profileData.social_links) {
          try {
            setSocials(JSON.parse(profileData.social_links));
          } catch (e) {
            console.error("Format social_links tidak valid (bukan JSON)");
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile socials:", err);
      }
    };
    fetchSocials();
  }, []);

  return (
    <footer className="py-12 border-t border-white/5 mt-20 relative z-10 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-xs font-mono">© 2026 KucingAbu Personal Hub.</p>
        <div className="flex gap-8 items-center">
          {socials.twitter && (
            <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-[#00F5FF] transition-colors">
              <FaTwitter size={18} />
            </a>
          )}
          {socials.instagram && (
            <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#8B5CF6] transition-colors">
              <FaInstagram size={18} />
            </a>
          )}
          {socials.github && (
            <a href={socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <FaGithub size={18} />
            </a>
          )}
          {socials.facebook && (
            <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
              <FaFacebook size={18} />
            </a>
          )}
          
          {/* Default icons jika belum disetting sama sekali */}
          {Object.keys(socials).length === 0 && (
             <>
               <FaInstagram size={18} className="text-white/20 cursor-not-allowed" />
               <FaGithub size={18} className="text-white/20 cursor-not-allowed" />
               <FaFacebook size={18} className="text-white/20 cursor-not-allowed" />
             </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {localStorage.getItem('token') ? (
            <Link to="/admin" className="text-[#8B5CF6] hover:text-[#7c4dff] transition-colors" title="Admin Panel">
              <Settings size={14} />
            </Link>
          ) : (
            <Link to="/login" className="text-gray-500 hover:text-white transition-colors" title="Admin Login">
              <Lock size={14} />
            </Link>
          )}
          <p className="text-[10px] tracking-widest font-mono uppercase text-[#00F5FF]">v1.0.0-clean</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
