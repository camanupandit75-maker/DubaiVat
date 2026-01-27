import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { ProductScreenshot } from './ProductScreenshot';

export const VideoShowcase: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

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
                <div className="relative aspect-video">
                    <ProductScreenshot
                        type="dashboard"
                        className="w-full h-full object-cover border-0 rounded-none shadow-none opacity-90 group-hover:opacity-100 transition-opacity"
                    />

                    {/* Video overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Play button */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 1 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="relative"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {/* Ripple effect */}
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
                            <div className="relative w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border-2 border-white/30 shadow-2xl group-hover:bg-white/20 transition-all">
                                {isPlaying ? (
                                    <Pause size={36} className="text-white" />
                                ) : (
                                    <Play size={36} className="text-white ml-1" />
                                )}
                            </div>
                        </motion.button>
                    </motion.div>

                    {/* Bottom controls */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-bold text-xl mb-1">See VAT Compliance in Action</h3>
                                <p className="text-gray-300 text-sm">2:34 • Full product walkthrough</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsMuted(!isMuted);
                                    }}
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
                        <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                initial={{ width: '0%' }}
                                animate={isPlaying ? { width: '100%' } : { width: '0%' }}
                                transition={{ duration: 154, ease: 'linear' }}
                            />
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
