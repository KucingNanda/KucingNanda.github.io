import React from 'react';

/**
 * Wrapper Utama untuk Background Cyberpunk & Konten
 */
const PageLayout = ({ children }) => {
    return (
        <div className="bg-[#0B0F19] min-h-screen text-white relative overflow-hidden selection:bg-[#00F5FF] selection:text-[#0B0F19]">
            {/* Dekorasi Latar Belakang (Neon Glows) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#8B5CF6]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00F5FF]/10 rounded-full blur-[120px]" />
                {/* Pola Carbon Fibre Texture */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </div>

            {/* Konten Utama */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default PageLayout;