import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { ProductScreenshot } from './ProductScreenshot';

export const VideoShowcase: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateProgress = () => {
            if (video.duration) {
                setProgress((video.currentTime / video.duration) * 100);
            }
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
        };

        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('timeupdate', updateProgress);
            video.removeEventListener('ended', handleEnded);
        };
    }, []);

    return (
        <motion.div
            className="relative group cursor-pointer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        >
            {/* Animated glow border */}
            <motion.div
                className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-amber-500 opacity-75 blur-lg"
                animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                style={{
                    backgroundSize: '200% 200%',
                }}
            />

            {/* Outer glow */}
            <div className="absolute -inset-8 bg-gradient-to-r from-blue-600/20 via-purple-500/20 to-cyan-600/20 rounded-[40px] blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />

            {/* Main container */}
            <div className="relative glass-dark rounded-3xl overflow-hidden border border-white/20">
                {/* Browser chrome */}
                <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 px-6 py-4 flex items-center justify-between border-b border-white/10">
                    <div className="flex items-center space-x-3">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                        </div>
                        <div className="ml-4 px-4 py-1.5 bg-gray-700/50 rounded-lg text-sm text-gray-400 font-mono flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            app.dubaitaxassistant.com/demo
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-500">
                        <Maximize2 size={16} className="hover:text-white transition-colors cursor-pointer" />
                    </div>
                </div>

                {/* Video content area */}
                <div className="relative aspect-video bg-black">
                    {/* Video Element */}
                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover"
                        // TODO: Replace with your actual Veo 3 generated video or product demo URL
                        src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                        poster=""
                        muted={isMuted}
                        playsInline
                        onClick={togglePlay}
                    />

                    {/* Placeholder Overlays (only visible when not playing) */}
                    {!isPlaying && (
                        <div className="absolute inset-0 pointer-events-none">
                            <ProductScreenshot
                                type="dashboard"
                                className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-black/40" />
                        </div>
                    )}

                    {/* Controls Overlay */}
                    <div
                        className={`absolute inset-0 transition-opacity duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
                        onClick={togglePlay} // Clicking anywhere on overlay toggles play
                    >
                        {/* Play button centered */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <motion.div
                                className="relative"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {/* Ripple effect (only when paused) */}
                                {!isPlaying && (
                                    <motion.div
                                        className="absolute inset-0 bg-white/20 rounded-full"
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.5, 0, 0.5],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: 'easeOut',
                                        }}
                                    />
                                )}

                                <div className={`pointer-events-auto relative w-24 h-24 backdrop-blur-xl rounded-full flex items-center justify-center border-2 border-white/30 shadow-2xl transition-all ${isPlaying ? 'bg-black/30 hover:bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}>
                                    {isPlaying ? (
                                        <Pause size={36} className="text-white" />
                                    ) : (
                                        <Play size={36} className="text-white ml-1" />
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Bottom controls */}
                        <div
                            className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-white font-bold text-xl mb-1">See VAT Compliance in Action</h3>
                                    <p className="text-gray-300 text-sm">2:34 • Full product walkthrough</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={toggleMute}
                                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                                    >
                                        {isMuted ? (
                                            <VolumeX size={20} className="text-white" />
                                        ) : (
                                            <Volume2 size={20} className="text-white" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                    style={{ width: `${progress}%` }}
                                    transition={{ ease: 'linear', duration: 0.1 }} // Smooth out updates slightly
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating badge */}
            <motion.div
                className="absolute -top-4 -right-4 z-20"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl shadow-amber-500/30 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    Live Demo
                </div>
            </motion.div>
        </motion.div>
    );
};
