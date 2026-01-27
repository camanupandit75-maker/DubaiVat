import React from 'react';
import { motion } from 'framer-motion';

interface Orb {
    id: number;
    size: number;
    x: string;
    y: string;
    color: string;
    duration: number;
    delay: number;
}

const orbs: Orb[] = [
    { id: 1, size: 600, x: '-10%', y: '-20%', color: 'from-blue-600/30 to-cyan-400/20', duration: 25, delay: 0 },
    { id: 2, size: 500, x: '70%', y: '10%', color: 'from-amber-500/25 to-orange-400/15', duration: 30, delay: 5 },
    { id: 3, size: 400, x: '40%', y: '60%', color: 'from-violet-500/20 to-purple-400/10', duration: 20, delay: 10 },
    { id: 4, size: 350, x: '80%', y: '70%', color: 'from-emerald-500/20 to-teal-400/15', duration: 28, delay: 8 },
    { id: 5, size: 450, x: '20%', y: '80%', color: 'from-blue-500/25 to-indigo-400/15', duration: 22, delay: 3 },
];

export const AnimatedGradientOrbs: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {orbs.map((orb) => (
                <motion.div
                    key={orb.id}
                    className={`absolute rounded-full bg-gradient-to-br ${orb.color} blur-3xl`}
                    style={{
                        width: orb.size,
                        height: orb.size,
                        left: orb.x,
                        top: orb.y,
                    }}
                    animate={{
                        x: [0, 50, -30, 0],
                        y: [0, -40, 30, 0],
                        scale: [1, 1.1, 0.95, 1],
                    }}
                    transition={{
                        duration: orb.duration,
                        delay: orb.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            {/* Mesh gradient overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14, 165, 233, 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 100% 50%, rgba(234, 179, 8, 0.1), transparent),
            radial-gradient(ellipse 50% 50% at 0% 100%, rgba(6, 182, 212, 0.1), transparent)
          `,
                }}
            />
        </div>
    );
};
