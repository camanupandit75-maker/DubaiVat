import React from 'react';
import { motion } from 'framer-motion';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    color: string;
}

const generateParticles = (count: number): Particle[] => {
    const colors = [
        'rgba(14, 165, 233, 0.6)', // blue
        'rgba(6, 182, 212, 0.5)',  // cyan
        'rgba(234, 179, 8, 0.4)',  // gold
        'rgba(255, 255, 255, 0.3)', // white
    ];

    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
    }));
};

export const ParticleBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
    const particles = React.useMemo(() => generateParticles(50), []);

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: particle.color,
                        boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            {/* Glowing orbs for extra depth */}
            <motion.div
                className="absolute w-96 h-96 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
                    left: '10%',
                    top: '20%',
                }}
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className="absolute w-80 h-80 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(234, 179, 8, 0.12) 0%, transparent 70%)',
                    right: '15%',
                    bottom: '30%',
                }}
                animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                    duration: 10,
                    delay: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
        </div>
    );
};
