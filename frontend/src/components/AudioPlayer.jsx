import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music } from 'lucide-react';

const AudioPlayer = ({ audioUrl, audioTitle }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5; // Default volume 50%
        }
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    if (!audioUrl) return null; // Jangan tampilkan jika belum ada lagu

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className={`bg-black/40 backdrop-blur-md border ${isPlaying ? 'border-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.3)]' : 'border-white/10'} rounded-2xl p-3 flex items-center gap-4 transition-all duration-300 w-[260px]`}>
                
                {/* Audio Element (Hidden) */}
                <audio 
                    ref={audioRef} 
                    src={audioUrl} 
                    loop 
                    onEnded={() => setIsPlaying(false)}
                />

                {/* Control Button */}
                <button 
                    onClick={togglePlay}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${isPlaying ? 'bg-[#00F5FF] text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                </button>

                {/* Song Info */}
                <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <Music size={10} className={isPlaying ? 'text-[#00F5FF] animate-pulse' : 'text-gray-500'} />
                        <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400">
                            {isPlaying ? 'Now Playing' : 'Vibe of the Day'}
                        </span>
                    </div>
                    <div className="text-sm font-bold text-white truncate w-full relative">
                        {isPlaying ? (
                            <div className="animate-marquee whitespace-nowrap">
                                {audioTitle || 'Unknown Track'}
                            </div>
                        ) : (
                            <div className="truncate">{audioTitle || 'Unknown Track'}</div>
                        )}
                    </div>
                </div>

                {/* Equalizer Bars (Fake Visualizer) */}
                {isPlaying && (
                    <div className="flex items-end gap-1 h-4 shrink-0 px-1">
                        <div className="w-1 bg-[#00F5FF] animate-[bounce_1s_infinite] h-full rounded-t-sm"></div>
                        <div className="w-1 bg-[#00F5FF] animate-[bounce_1s_infinite_0.2s] h-3/4 rounded-t-sm"></div>
                        <div className="w-1 bg-[#00F5FF] animate-[bounce_1s_infinite_0.4s] h-1/2 rounded-t-sm"></div>
                    </div>
                )}
            </div>
            
            {/* CSS for marquee effect */}
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(10%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                    display: inline-block;
                    animation: marquee 8s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default AudioPlayer;
