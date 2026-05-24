import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music, SkipBack, SkipForward } from 'lucide-react';
import { apiService } from '../services/api';

const AudioPlayer = () => {
    const [playlist, setPlaylist] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const audioRef = useRef(null);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const res = await apiService.getPlaylist();
                if (Array.isArray(res)) {
                    setPlaylist(res);
                }
            } catch (err) {
                console.error("Failed to fetch playlist:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlaylist();
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5; // Default volume 50%
            if (isPlaying) {
                // When track changes and is already playing, play the new track automatically
                audioRef.current.play().catch(e => console.error("Auto-play prevented", e));
            }
        }
    }, [currentIndex]);

    const togglePlay = () => {
        if (playlist.length === 0) return;
        
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Play prevented", e));
        }
        setIsPlaying(!isPlaying);
    };

    const playNext = () => {
        if (playlist.length === 0) return;
        setIsPlaying(true);
        setCurrentIndex((prev) => (prev + 1) % playlist.length);
    };

    const playPrev = () => {
        if (playlist.length === 0) return;
        setIsPlaying(true);
        setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    };

    if (loading || playlist.length === 0) return null; // Sembunyikan jika tidak ada lagu

    const currentTrack = playlist[currentIndex];

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className={`bg-black/40 backdrop-blur-md border ${isPlaying ? 'border-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.3)]' : 'border-white/10'} rounded-2xl p-3 flex items-center gap-3 transition-all duration-300 w-[280px]`}>
                
                {/* Audio Element (Hidden) */}
                <audio 
                    ref={audioRef} 
                    src={currentTrack.audio_url} 
                    onEnded={playNext}
                />

                {/* Control Buttons */}
                <div className="flex items-center gap-1 shrink-0">
                    <button 
                        onClick={playPrev}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <SkipBack size={14} fill="currentColor" />
                    </button>
                    <button 
                        onClick={togglePlay}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isPlaying ? 'bg-[#00F5FF] text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                    </button>
                    <button 
                        onClick={playNext}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <SkipForward size={14} fill="currentColor" />
                    </button>
                </div>

                {/* Song Info */}
                <div className="flex-1 overflow-hidden ml-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <Music size={10} className={isPlaying ? 'text-[#00F5FF] animate-pulse' : 'text-gray-500'} />
                        <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400 truncate">
                            Playlist ({currentIndex + 1}/{playlist.length})
                        </span>
                    </div>
                    <div className="text-sm font-bold text-white truncate w-full relative">
                        {isPlaying ? (
                            <div className="animate-marquee whitespace-nowrap">
                                {currentTrack.title || 'Unknown Track'}
                            </div>
                        ) : (
                            <div className="truncate">{currentTrack.title || 'Unknown Track'}</div>
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
