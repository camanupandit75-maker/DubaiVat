import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Briefcase, Landmark, Store, Building, Wallet, TrendingUp, Globe, Star } from 'lucide-react';

interface Client {
    name: string;
    icon: React.ReactNode;
    gradient: string;
    borderGradient: string;
    industry: string;
}

const clients: Client[] = [
    { name: 'Emirates Trading Co.', icon: <Building2 size={22} />, gradient: 'from-blue-500 to-cyan-400', borderGradient: 'from-blue-400 via-cyan-300 to-blue-500', industry: 'Trading' },
    { name: 'Dubai Finance Group', icon: <Wallet size={22} />, gradient: 'from-emerald-500 to-teal-400', borderGradient: 'from-emerald-400 via-teal-300 to-emerald-500', industry: 'Finance' },
    { name: 'Al Maktoum Ventures', icon: <Briefcase size={22} />, gradient: 'from-violet-500 to-purple-400', borderGradient: 'from-violet-400 via-purple-300 to-violet-500', industry: 'Ventures' },
    { name: 'Sharjah Holdings', icon: <Landmark size={22} />, gradient: 'from-amber-500 to-orange-400', borderGradient: 'from-amber-400 via-orange-300 to-amber-500', industry: 'Holdings' },
    { name: 'Abu Dhabi Retail', icon: <Store size={22} />, gradient: 'from-rose-500 to-pink-400', borderGradient: 'from-rose-400 via-pink-300 to-rose-500', industry: 'Retail' },
    { name: 'Gulf Investments', icon: <TrendingUp size={22} />, gradient: 'from-indigo-500 to-blue-400', borderGradient: 'from-indigo-400 via-blue-300 to-indigo-500', industry: 'Investment' },
    { name: 'RAK Business Hub', icon: <Building size={22} />, gradient: 'from-cyan-500 to-sky-400', borderGradient: 'from-cyan-400 via-sky-300 to-cyan-500', industry: 'Business' },
    { name: 'UAE Global Trade', icon: <Globe size={22} />, gradient: 'from-fuchsia-500 to-pink-400', borderGradient: 'from-fuchsia-400 via-pink-300 to-fuchsia-500', industry: 'Global' },
];

export const ClientLogoMarquee: React.FC = () => {
    const doubledClients = [...clients, ...clients];

    return (
        <div className="relative w-full overflow-hidden py-10">
            {/* Gradient masks */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex gap-5"
                animate={{
                    x: [0, -50 * clients.length * 14],
                }}
                transition={{
                    x: {
                        duration: 35,
                        repeat: Infinity,
                        ease: 'linear',
                    },
                }}
            >
                {doubledClients.map((client, index) => (
                    <div
                        key={`${client.name}-${index}`}
                        className="flex-shrink-0 relative group cursor-pointer"
                    >
                        {/* Gradient border wrapper */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${client.borderGradient} rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 blur-[1px]`} />

                        {/* Inner card */}
                        <div className="relative m-[2px] px-5 py-3 rounded-2xl bg-white/95 backdrop-blur-sm flex items-center gap-3 group-hover:bg-white transition-all duration-300">
                            {/* Decorative shine */}
                            <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

                            {/* Icon with gradient background */}
                            <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${client.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                                {client.icon}
                                {/* Icon shine */}
                                <div className="absolute top-1 left-1 w-3 h-3 bg-white/30 rounded-full blur-sm" />
                            </div>

                            {/* Text content */}
                            <div className="flex flex-col">
                                <span className="text-gray-800 font-bold text-sm whitespace-nowrap tracking-tight leading-tight">
                                    {client.name}
                                </span>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <Star size={10} className="text-amber-400 fill-amber-400" />
                                    <span className="text-[10px] text-gray-500 font-medium">{client.industry}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};
