import React, { useRef, useState } from 'react';
import { Receipt, FileText, Calculator, ArrowRight, CheckCircle, Users, TrendingUp, Shield, Check, X, Star, Play, BarChart3, Camera, Crown, Sparkles, Award, Lock, Globe } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '../components/Button';
import { useApp } from '../context/AppContext';
import { ProductScreenshot } from '../components/ProductScreenshot';
import { HorizontalProductScroll } from '../components/HorizontalProductScroll';
import { ParticleBackground } from '../components/ParticleBackground';
import { AnimatedGradientOrbs } from '../components/AnimatedGradientOrbs';
import { ClientLogoMarquee } from '../components/ClientLogoMarquee';
import { VideoShowcase } from '../components/VideoShowcase';


export const LandingPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [activeFeature, setActiveFeature] = useState<'dashboard' | 'invoice' | 'receipt' | 'returns'>('dashboard');
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [pricingToggle, setPricingToggle] = useState<'monthly' | 'annual'>('monthly');
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Camera size={32} />,
      title: 'Instant Receipt Recognition',
      description: 'Snap photos of receipts and our OCR extracts all details automatically. Never manually enter a receipt again.',
      color: 'from-blue-500 to-cyan-500',
      image: 'receipt'
    },
    {
      icon: <FileText size={32} />,
      title: 'FTA-Compliant Invoices',
      description: 'Generate UAE VAT invoices in seconds with automatic tax calculations and professional templates.',
      color: 'from-emerald-500 to-teal-500',
      image: 'invoice'
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'Real-Time VAT Dashboard',
      description: 'See your VAT position at a glance. Track collected vs paid, and know exactly what you owe.',
      color: 'from-violet-500 to-purple-500',
      image: 'dashboard'
    }
  ];

  const testimonials = [
    {
      name: 'Ahmed Al Mansouri',
      role: 'Freelance Consultant',
      company: 'Dubai',
      location: 'Dubai, UAE',
      text: 'Saved me AED 12,000/year compared to QuickBooks. Perfect for UAE freelancers who need simple VAT tracking.',
      rating: 5,
      avatar: 'A',
      verified: true,
      metric: 'Saved AED 12,000/year'
    },
    {
      name: 'Sarah Khan',
      role: 'Small Business Owner',
      company: 'Sharjah Trading LLC',
      location: 'Sharjah, UAE',
      text: 'Setup took 10 minutes. The receipt scanner is a game-changer — I used to spend hours organizing paper receipts.',
      rating: 5,
      avatar: 'S',
      verified: true,
      metric: 'Setup in 10 minutes'
    },
    {
      name: 'Omar Abdullah',
      role: 'Accountant',
      company: 'Managing 15 Clients',
      location: 'Abu Dhabi, UAE',
      text: 'I recommend this to all my small business clients. Much easier than teaching them Zoho or QuickBooks.',
      rating: 5,
      avatar: 'O',
      verified: true,
      metric: '15 clients onboarded'
    }
  ];

  const comparisonData = [
    { feature: 'Monthly Price', zoho: 'AED 165+', us: 'AED 49' },
    { feature: 'UAE VAT Focus', zoho: 'Generic', us: 'Built for UAE' },
    { feature: 'Setup Time', zoho: '2+ hours', us: '10 minutes' },
    { feature: 'Receipt OCR', zoho: 'Extra cost', us: 'Included' },
    { feature: 'Learning Curve', zoho: 'Steep', us: 'Instant' },
    { feature: 'Customer Support', zoho: 'Offshore', us: 'UAE-based' }
  ];

  const trustBadges = [
    { icon: <Shield size={24} />, label: 'FTA VAT Compliant', desc: '100% compliant' },
    { icon: <Globe size={24} />, label: 'Built for UAE', desc: 'Local expertise' },
    { icon: <Lock size={24} />, label: 'Bank-Level Security', desc: 'AES-256 encrypted' },
    { icon: <Users size={24} />, label: '5,000+ Businesses', desc: 'Trust us' }
  ];

  const FeatureCard = ({ feature, index }: any) => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.4, 0.25, 1] }}
        className="group"
      >
        <div className="card-premium relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color}`} />
          <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />

          <div className="relative z-10">
            <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {feature.icon}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              {feature.description}
            </p>

            <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-lg group-hover:shadow-xl transition-shadow duration-300 h-56">
              <div className="absolute inset-0 transform scale-[0.65] origin-top-left w-[154%] h-[154%]">
                <ProductScreenshot type={feature.image as any} className="w-full h-full border-0 rounded-none shadow-none" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const ComparisonRow = ({ row, index }: any) => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.tr
        ref={ref}
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
        className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <td className="py-5 px-6 font-semibold text-gray-900">{row.feature}</td>
        <td className="py-5 px-6 text-center text-gray-600">{row.zoho}</td>
        <td className="py-5 px-6 text-center bg-gradient-to-r from-blue-50/80 to-blue-100/80 relative">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-200 opacity-0"
            animate={{ opacity: isHovered ? 0.5 : 0 }}
            transition={{ duration: 0.3 }}
          />
          <span className="font-bold text-[#0ea5e9] inline-flex items-center justify-center relative z-10">
            {row.us}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={inView ? { scale: 1, rotate: 0 } : {}}
              transition={{
                delay: index * 0.08 + 0.3,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              <CheckCircle className="ml-2 text-emerald-600" size={20} />
            </motion.div>
          </span>
        </td>
      </motion.tr>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                <Calculator className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Dubai Tax Assistant</span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="nav-link">Features</a>
              <a href="#pricing" className="nav-link">Pricing</a>
              <a href="#testimonials" className="nav-link">Reviews</a>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
                onClick={() => setCurrentPage('login')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign in
              </motion.button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => setCurrentPage('register')} className="btn-premium bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg glow">
                  Get Started
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Premium background layers */}
        <div className="absolute inset-0 aurora-bg" />
        <AnimatedGradientOrbs />
        <ParticleBackground />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/30 to-amber-50/30" />

        <motion.div
          className="absolute inset-0 opacity-30"
          style={{ y }}
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl float-animation" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl float-animation-delayed" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl float-animation" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              style={{ opacity }}
              className="space-y-8"
            >
              {/* Premium badge with shimmer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center space-x-3 glass rounded-full px-6 py-3 shadow-lg shimmer"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold text-gray-700">🏆 Trusted by 5,000+ UAE Businesses</span>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles size={16} className="text-amber-500" />
                </motion.div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1]"
              >
                <span className="block text-gray-900 mb-4">VAT Compliance for</span>
                <span className="block text-gray-900 mb-4">UAE Businesses</span>
                <motion.span
                  className="block text-shimmer text-4xl md:text-5xl lg:text-6xl font-extrabold mt-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  Without Expensive
                  <br />
                  Accounting Software
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-600 leading-relaxed max-w-2xl"
              >
                Track VAT, scan receipts, generate invoices, and avoid FTA penalties — built specifically for freelancers and small businesses in the UAE.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="btn-premium bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-2xl glow-intense text-lg px-10 py-6"
                    onClick={() => setCurrentPage('register')}
                  >
                    <span>Get Started Free</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2" size={20} />
                    </motion.div>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="glass border-2 border-gray-200 text-gray-700 text-lg px-10 py-6 hover:border-blue-400"
                  >
                    <Play className="mr-2" size={20} />
                    <span>Watch Live Demo</span>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap items-center gap-6 pt-6"
              >
                <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full">
                  <CheckCircle className="text-emerald-500" size={20} />
                  <span className="text-sm text-gray-700 font-medium">No credit card required</span>
                </div>
                <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
                  <CheckCircle className="text-blue-500" size={20} />
                  <span className="text-sm text-gray-700 font-medium">14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2 bg-amber-50 px-4 py-2 rounded-full">
                  <Shield className="text-amber-500" size={20} />
                  <span className="text-sm text-gray-700 font-medium">FTA Compliant</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative lg:block hidden"
            >
              <div className="relative">
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-3xl blur-3xl"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.7, 0.5]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Floating decorative elements */}
                <motion.div
                  className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl z-20"
                  animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Crown className="text-white" size={32} />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-8 w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-xl z-20"
                  animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <CheckCircle className="text-white" size={28} />
                </motion.div>

                <div className="relative glass-dark rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                  <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2 border-b border-gray-700">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                    <div className="ml-4 text-xs text-gray-400 font-mono flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      app.dubaitaxassistant.com
                    </div>
                  </div>
                  <ProductScreenshot type="dashboard" animated className="border-0 rounded-none shadow-none h-[600px]" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-3 bg-blue-500 rounded-full"
              animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      <section className="py-8 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {trustBadges.map((badge, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center space-y-2"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white">
                  {badge.icon}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{badge.label}</p>
                  <p className="text-xs text-blue-200">{badge.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Client Logo Marquee - Social Proof */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Trusted by Leading UAE Businesses
            </p>
          </motion.div>
          <ClientLogoMarquee />
        </div>
      </section>

      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 glass rounded-full px-6 py-2 text-sm font-semibold text-blue-600 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Play size={16} />
              <span>Product Gallery</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              See Dubai Tax Assistant
              <br />
              <span className="text-gradient">in Action</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              Explore our intuitive interface — built for UAE business owners who value simplicity
            </p>
            <p className="text-sm text-gray-500 italic">
              Hover to pause • Scroll automatically
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <HorizontalProductScroll />
        </motion.div>
      </section>

      <section className="py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 glass rounded-full px-6 py-2 text-sm font-semibold text-blue-600 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles size={16} />
              <span>Feature Deep Dive</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Every Feature
              <br />
              <span className="text-gradient">Designed for UAE Businesses</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Purpose-built tools that understand UAE VAT compliance — not generic accounting software
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 glass rounded-full px-6 py-2 text-sm font-semibold text-emerald-600 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Play size={16} />
              <span>Interactive Preview</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Explore Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Click each tab to see how Dubai Tax Assistant simplifies VAT compliance
            </p>
          </motion.div>

          <div className="flex justify-center mb-12">
            <div className="inline-flex glass rounded-2xl p-2 space-x-2">
              {[
                { key: 'dashboard', label: 'VAT Dashboard', icon: BarChart3 },
                { key: 'invoice', label: 'Invoices', icon: FileText },
                { key: 'receipt', label: 'Receipts', icon: Camera },
                { key: 'returns', label: 'VAT Returns', icon: Receipt }
              ].map((tab) => (
                <motion.button
                  key={tab.key}
                  onClick={() => setActiveFeature(tab.key as any)}
                  className={`px-8 py-4 rounded-xl font-semibold text-base flex items-center space-x-3 transition-all duration-300 ${activeFeature === tab.key
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-xl glow'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  whileHover={{ scale: activeFeature === tab.key ? 1 : 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <tab.icon size={20} />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl blur-3xl" />
                <div className="relative glass-dark rounded-3xl shadow-2xl overflow-hidden">
                  <div className="bg-gray-800 px-6 py-4 flex items-center space-x-3 border-b border-gray-700">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <div className="ml-4 text-sm text-gray-400 font-mono">Dubai Tax Assistant • {activeFeature}</div>
                  </div>
                  <ProductScreenshot type={activeFeature} animated className="border-0 rounded-none shadow-none h-[600px]" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 glass rounded-full px-6 py-2 text-sm font-semibold text-blue-600 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Award size={18} />
              <span>Best for Small Businesses</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Dubai Tax Assistant vs
              <br />
              <span className="text-gray-500">Traditional Accounting Software</span>
            </h2>
            <p className="text-xl text-gray-600">
              Why small businesses choose us over Zoho & QuickBooks
            </p>
          </motion.div>

          <div className="glass rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-6 px-8 text-gray-700 font-bold text-lg">Feature</th>
                    <th className="text-center py-6 px-8 text-gray-700 font-bold text-lg">Zoho / QuickBooks</th>
                    <th className="text-center py-6 px-8 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-900 font-bold text-lg relative">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-200/50 to-cyan-200/50"
                        animate={{
                          opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <div className="flex items-center justify-center space-x-2 relative z-10">
                        <span>Dubai Tax Assistant</span>
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Crown size={22} className="text-amber-500" />
                        </motion.div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <ComparisonRow key={index} row={row} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-full px-6 py-2 text-sm font-semibold mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Play size={16} />
              <span>Product Demo</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Watch How VAT
              <br />
              <span className="text-gradient-gold">Becomes Simple</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              30-second walkthrough of the platform — see why UAE businesses choose us
            </p>
          </motion.div>

          <VideoShowcase />
        </div>
      </section>

      <section id="testimonials" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 glass rounded-full px-6 py-2 text-sm font-semibold text-amber-600 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Star size={16} className="fill-amber-600" />
              <span>Trusted by UAE Business Owners</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Real Reviews from
              <br />
              <span className="text-gradient">Real Customers</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => {
              const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  className="group"
                >
                  <div className="card-premium h-full">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                            {testimonial.verified && (
                              <CheckCircle size={18} className="text-emerald-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} size={18} className="fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <span>🇦🇪</span>
                        <span>{testimonial.location}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6 italic">
                      "{testimonial.text}"
                    </p>

                    <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 text-sm text-emerald-700 font-semibold">
                      <TrendingUp size={14} />
                      <span>{testimonial.metric}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Start free. Upgrade when you're ready.
            </p>

            <div className="inline-flex glass rounded-2xl p-2">
              <button
                onClick={() => setPricingToggle('monthly')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${pricingToggle === 'monthly'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setPricingToggle('annual')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${pricingToggle === 'annual'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <span>Annual</span>
                <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8 }}
              className="relative"
            >
              <div className="card-premium h-full text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Free</h3>
                <div className="text-6xl font-bold text-gray-900 mb-2">AED 0</div>
                <p className="text-gray-600 font-medium mb-8">14-day free trial</p>

                <ul className="space-y-4 mb-10 text-left">
                  {[
                    'Up to 20 invoices/month',
                    'Basic receipt scanning',
                    'VAT calculator',
                    'Email support',
                    'Single business'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <Check className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant="secondary"
                  className="w-full glass border-2 border-gray-200 hover:border-blue-600 transition-all"
                  onClick={() => setCurrentPage('register')}
                >
                  Start Free Trial
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="relative"
            >
              <motion.div
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center shadow-2xl border-2 border-white">
                  <Crown size={16} className="mr-2" />
                  Most Popular
                </span>
              </motion.div>

              <div className="card-premium h-full text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Premium</h3>
                  <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                    AED {pricingToggle === 'monthly' ? '99' : '79'}
                  </div>
                  <p className="text-gray-600 font-medium mb-8">per month</p>

                  <ul className="space-y-4 mb-10 text-left">
                    {[
                      'Unlimited invoices',
                      'Advanced receipt OCR',
                      'Multi-business support',
                      'VAT return exports',
                      'Priority support',
                      'API access'
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <Check className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full btn-premium bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-2xl glow"
                    onClick={() => setCurrentPage('register')}
                  >
                    Start Free Trial
                  </Button>
                  <p className="text-xs text-gray-500 mt-4">No credit card required • Cancel anytime</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                  <Calculator className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold">Dubai Tax Assistant</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                VAT compliance made simple for UAE businesses. Built by entrepreneurs, for entrepreneurs.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Compliance</h4>
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2 text-xs">
                  <Shield size={14} />
                  <span>FTA Compliant</span>
                </div>
                <div className="inline-flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2 text-xs">
                  <Lock size={14} />
                  <span>AES-256 Encrypted</span>
                </div>
                <div className="inline-flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2 text-xs">
                  <span>🇦🇪</span>
                  <span>UAE Based</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Dubai Tax Assistant. Made with ❤️ for UAE entrepreneurs.
            </p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-50 glass-dark border-t-2 border-blue-500/30"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-white font-bold text-xl mb-1">
                    Ready to Simplify VAT Compliance?
                  </p>
                  <p className="text-gray-300 text-sm">
                    Join 5,000+ UAE businesses • No credit card required
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    className="btn-premium bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-2xl glow whitespace-nowrap"
                    onClick={() => setCurrentPage('register')}
                  >
                    Start Free — No Credit Card Required
                  </Button>
                  <motion.button
                    className="text-gray-300 hover:text-white transition-colors p-2"
                    onClick={() => setShowStickyCTA(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
