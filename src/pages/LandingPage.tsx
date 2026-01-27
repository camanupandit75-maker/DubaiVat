import React, { useRef } from 'react';
import { Receipt, FileText, Calculator, ArrowRight, CheckCircle, Users, TrendingUp, Shield, Zap, Clock, Check, X, Star, Play, BarChart3, Camera, DollarSign, Crown, Sparkles, Award } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { ProductScreenshot } from '../components/ProductScreenshot';

export const LandingPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  const features = [
    {
      icon: <Receipt size={40} />,
      title: 'Turn Receipt Chaos Into Organized Records',
      description: 'Scan, store, and retrieve receipts instantly. Never lose a tax-deductible expense again.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: <FileText size={40} />,
      title: 'Send Professional UAE VAT Invoices',
      description: 'FTA-compliant invoices generated in minutes. No accounting degree required.',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: <BarChart3 size={40} />,
      title: 'Always Know How Much VAT You Owe',
      description: 'Automatic VAT tracking with real-time summaries. Stop guessing, start knowing.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const productFeatures = [
    { icon: <BarChart3 size={20} />, text: 'Track VAT collected vs VAT paid' },
    { icon: <FileText size={20} />, text: 'Generate UAE VAT invoices in seconds' },
    { icon: <Camera size={20} />, text: 'Organize receipts with OCR scanning' },
    { icon: <Calculator size={20} />, text: 'Prepare VAT return summaries instantly' }
  ];

  const testimonials = [
    {
      name: 'Ahmed Al Mansouri',
      role: 'Freelance Consultant',
      company: 'Dubai',
      text: 'Saved me AED 12,000/year compared to QuickBooks. Perfect for UAE freelancers who need simple VAT tracking.',
      rating: 5,
      avatar: 'A'
    },
    {
      name: 'Sarah Khan',
      role: 'Small Business Owner',
      company: 'Sharjah Trading LLC',
      text: 'Setup took 10 minutes. The receipt scanner is a game-changer — I used to spend hours organizing paper receipts.',
      rating: 5,
      avatar: 'S'
    },
    {
      name: 'Omar Abdullah',
      role: 'Accountant',
      company: 'Managing 15 Clients',
      text: 'I recommend this to all my small business clients. Much easier than teaching them Zoho or QuickBooks.',
      rating: 5,
      avatar: 'O'
    }
  ];

  const perfectFor = [
    'Freelancers & Consultants',
    'Small Retail Shops',
    'Home-Based Businesses',
    'Service Providers',
    'Accountants Managing Clients'
  ];

  const notIdealFor = [
    'Large Enterprises (50+ employees)',
    'Payroll-Heavy Corporations',
    'Complex Inventory Management',
    'Multi-Currency Operations'
  ];

  const comparisonData = [
    { feature: 'Monthly Price', zoho: 'AED 250+', us: 'AED 99', highlight: true },
    { feature: 'Ease of Use', zoho: 'Complex', us: 'Simple', highlight: false },
    { feature: 'UAE VAT Focus', zoho: 'Generic', us: 'Built for UAE', highlight: true },
    { feature: 'Learning Curve', zoho: '2-3 weeks', us: '10 minutes', highlight: true },
    { feature: 'FTA Compliance', zoho: 'Manual setup', us: 'Built-in', highlight: false }
  ];

  const productScreens = [
    { title: 'VAT Dashboard', icon: BarChart3, color: 'from-blue-500 to-blue-600' },
    { title: 'Invoice Generator', icon: FileText, color: 'from-green-500 to-green-600' },
    { title: 'Receipt Scanner', icon: Camera, color: 'from-purple-500 to-purple-600' },
    { title: 'VAT Calculator', icon: Calculator, color: 'from-orange-500 to-orange-600' },
    { title: 'VAT Returns', icon: Receipt, color: 'from-pink-500 to-pink-600' },
    { title: 'Expense Tracker', icon: DollarSign, color: 'from-cyan-500 to-cyan-600' }
  ];

  const FeatureCard = ({ feature, index }: any) => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <motion.div
          whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
          className="relative"
        >
          <Card hover className="text-center group relative overflow-hidden h-full border-2 border-gray-100 hover:border-[#C5A572]/30 transition-all duration-300">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            <div className="relative z-10 p-8">
              <motion.div
                className={`w-20 h-20 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 ${feature.color} shadow-md group-hover:shadow-xl transition-shadow duration-300`}
                whileHover={{ scale: 1.08, rotate: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-[#1B4B7F] mb-4 group-hover:text-[#C5A572] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                {feature.description}
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    );
  };

  const ComparisonRow = ({ row, index }: any) => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

    return (
      <motion.tr
        ref={ref}
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
      >
        <td className="py-4 px-6 font-medium text-gray-900">{row.feature}</td>
        <td className="py-4 px-6 text-center text-gray-600">{row.zoho}</td>
        <td className="py-4 px-6 text-center bg-gradient-to-r from-blue-50 to-blue-100">
          <span className="font-bold text-[#1B4B7F] inline-flex items-center justify-center">
            {row.us}
            <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
            >
              <CheckCircle className="ml-2 text-green-600" size={18} />
            </motion.div>
          </span>
        </td>
      </motion.tr>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white/95 border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Calculator className="text-[#C5A572]" size={32} />
              <span className="text-xl font-bold text-[#1B4B7F]">Dubai Tax Assistant</span>
            </motion.div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-[#1B4B7F] transition-colors font-medium">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-[#1B4B7F] transition-colors font-medium">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-[#1B4B7F] transition-colors font-medium">Reviews</a>
              <Button variant="secondary" size="sm" onClick={() => setCurrentPage('login')}>
                Login
              </Button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" onClick={() => setCurrentPage('register')}>
                  Get Started Free
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#f8fafc] via-white to-blue-50 pt-20 pb-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-[#C5A572] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles size={16} />
                <span>Trusted by 5,000+ UAE Freelancers & Small Businesses</span>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1B4B7F] mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                VAT Compliance for UAE Businesses —{' '}
                <span className="relative inline-block">
                  <span className="text-[#C5A572] relative z-10 bg-clip-text">Without Expensive Accounting Software</span>
                  <motion.span
                    className="absolute -inset-1 bg-gradient-to-r from-[#C5A572]/20 to-[#C5A572]/10 blur-lg"
                    animate={{
                      opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Track VAT, scan receipts, generate invoices, and avoid FTA penalties — built for freelancers and small businesses in the UAE.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 shadow-2xl relative overflow-hidden group focus:ring-4 focus:ring-blue-300 transition-all"
                    onClick={() => setCurrentPage('register')}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started Free
                      <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="secondary" size="lg" className="text-lg px-8 py-6 group shadow-lg">
                    <Play size={20} className="group-hover:scale-110 transition-transform duration-300" />
                    Watch Live Demo
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {[
                  { icon: Shield, text: 'FTA VAT Compliant', color: 'text-green-600' },
                  { icon: Users, text: '5,000+ UAE Businesses', color: 'text-blue-600' },
                  { icon: Award, text: 'Save AED 1,000+/year', color: 'text-[#C5A572]' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center space-x-2 text-sm text-gray-700 bg-white/80 backdrop-blur-sm rounded-lg py-2 px-4 border border-gray-200/50 shadow-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2, borderColor: 'rgba(27, 75, 127, 0.3)', transition: { duration: 0.2 } }}
                  >
                    <item.icon className={item.color} size={18} />
                    <span className="font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
              <motion.div
                className="relative"
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                  style={{
                    transform: 'perspective(1200px) rotateY(-8deg) rotateX(2deg)',
                  }}
                  whileHover={{
                    transform: 'perspective(1200px) rotateY(0deg) rotateX(0deg)',
                    transition: { duration: 0.4 }
                  }}
                >
                  <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2 border-b border-gray-700">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 text-xs text-gray-400 font-mono">Dubai Tax Assistant</div>
                  </div>
                  <ProductScreenshot type="dashboard" animated className="border-0 rounded-none shadow-none" />
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl border border-gray-200 p-4 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Net VAT Owed</p>
                    <p className="text-lg font-bold text-[#1B4B7F]">AED 7,330</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1B4B7F] mb-4">
              See Dubai Tax Assistant in Action
            </h2>
            <p className="text-xl text-gray-600">
              Real screens from the product — not mockups
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {productFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0 text-[#1B4B7F] group-hover:shadow-lg transition-shadow"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{feature.text}</p>
                  </div>
                </motion.div>
              ))}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button size="lg" className="w-full mt-6" onClick={() => setCurrentPage('register')}>
                  Start Using It Free <ArrowRight size={20} />
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-20 blur-2xl"></div>
              <motion.div
                className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden"
                style={{ transform: 'perspective(1000px) rotateY(-5deg)' }}
                whileHover={{
                  scale: 1.02,
                  rotateY: 0,
                  transition: { duration: 0.3 }
                }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2 border-b border-gray-700">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-white backdrop-blur-xl bg-white/80">
                  <motion.div
                    className="grid grid-cols-2 gap-4 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                    >
                      <p className="text-xs text-gray-600 mb-1">VAT Collected</p>
                      <p className="text-2xl font-bold text-green-600">AED 15,750</p>
                    </motion.div>
                    <motion.div
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                    >
                      <p className="text-xs text-gray-600 mb-1">VAT Paid</p>
                      <p className="text-2xl font-bold text-red-600">AED 8,420</p>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-xs text-gray-600 mb-1">Net VAT Owed</p>
                    <p className="text-3xl font-bold text-[#1B4B7F]">AED 7,330</p>
                  </motion.div>
                  <div className="mt-4 space-y-2">
                    {[65, 85, 45, 75].map((width, i) => (
                      <motion.div
                        key={i}
                        className="h-8 bg-gray-200 rounded overflow-hidden"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                          initial={{ width: "0%" }}
                          whileInView={{ width: `${width}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <BarChart3 size={16} />
            <span>Real Screens from the Product — Not Mockups</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B4B7F] mb-3">
            See Every Feature in Action
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From VAT tracking to invoice generation, everything you need in one beautiful interface
          </p>
        </motion.div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          <div className="flex space-x-8 animate-scroll-smooth py-8">
            {[
              { type: 'dashboard', title: 'VAT Dashboard', desc: 'Real-time VAT tracking' },
              { type: 'invoice', title: 'Invoice Generator', desc: 'FTA-compliant invoices' },
              { type: 'receipt', title: 'Receipt Scanner', desc: 'OCR expense capture' },
              { type: 'calculator', title: 'VAT Calculator', desc: 'Instant calculations' },
              { type: 'returns', title: 'VAT Returns', desc: 'Quarterly filing prep' },
              { type: 'expenses', title: 'Expense Tracker', desc: 'Categorized expenses' },
              { type: 'dashboard', title: 'VAT Dashboard', desc: 'Real-time VAT tracking' },
              { type: 'invoice', title: 'Invoice Generator', desc: 'FTA-compliant invoices' },
              { type: 'receipt', title: 'Receipt Scanner', desc: 'OCR expense capture' },
              { type: 'calculator', title: 'VAT Calculator', desc: 'Instant calculations' },
              { type: 'returns', title: 'VAT Returns', desc: 'Quarterly filing prep' },
              { type: 'expenses', title: 'Expense Tracker', desc: 'Categorized expenses' }
            ].map((screen, i) => (
              <motion.div
                key={i}
                className="flex-shrink-0 w-[420px] group cursor-pointer"
                whileHover={{ scale: 1.03, y: -8, transition: { duration: 0.3 } }}
              >
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden group-hover:shadow-2xl transition-shadow duration-300">
                    <ProductScreenshot type={screen.type as any} className="border-0 rounded-none shadow-none h-80" />
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-1">{screen.title}</h3>
                      <p className="text-sm text-gray-600">{screen.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1B4B7F] mb-4">
              Built for Results, Not Complexity
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to stay VAT compliant without the accounting headaches
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1B4B7F] mb-4">
              Is This Right for You?
            </h2>
            <p className="text-xl text-gray-600">
              Honest about who we serve best
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-2 border-green-200 hover:border-green-400 transition-colors hover:shadow-green-200/50 hover:shadow-xl">
                <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
                  <CheckCircle className="mr-3" size={28} />
                  Perfect For
                </h3>
                <ul className="space-y-4">
                  {perfectFor.map((item, index) => {
                    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
                    return (
                      <motion.li
                        key={index}
                        ref={ref}
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: index * 0.1 }}
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={inView ? { scale: 1 } : {}}
                          transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                        >
                          <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                        </motion.div>
                        <span className="text-gray-700 font-medium">{item}</span>
                      </motion.li>
                    );
                  })}
                </ul>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-2 border-red-200 hover:border-red-400 transition-colors hover:shadow-red-200/50 hover:shadow-xl">
                <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center">
                  <X className="mr-3" size={28} />
                  Not Ideal For
                </h3>
                <ul className="space-y-4">
                  {notIdealFor.map((item, index) => {
                    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
                    return (
                      <motion.li
                        key={index}
                        ref={ref}
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: index * 0.1 }}
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: 0 }}
                          animate={inView ? { scale: 1, rotate: 90 } : {}}
                          transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                        >
                          <X className="text-red-600 flex-shrink-0 mt-1" size={20} />
                        </motion.div>
                        <span className="text-gray-700 font-medium">{item}</span>
                      </motion.li>
                    );
                  })}
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Award size={18} />
              <span>Best for Small Businesses</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1B4B7F] mb-4">
              Dubai Tax Assistant vs Traditional Accounting Software
            </h2>
            <p className="text-xl text-gray-600">
              Why small businesses choose us over Zoho & QuickBooks
            </p>
          </motion.div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold">Feature</th>
                    <th className="text-center py-4 px-6 text-gray-600 font-semibold">Zoho / QuickBooks</th>
                    <th className="text-center py-4 px-6 bg-gradient-to-r from-blue-50 to-blue-100 text-[#1B4B7F] font-semibold">
                      <div className="flex items-center justify-center space-x-2">
                        <span>Dubai Tax Assistant</span>
                        <Crown size={18} className="text-[#C5A572]" />
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
          </Card>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-gradient-to-br from-[#1B4B7F] to-[#153d6b] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#C5A572] rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Trusted by UAE Business Owners
            </h2>
            <p className="text-xl text-blue-100">
              Real reviews from real customers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => {
              const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 hover:scale-105 transition-all">
                    <div className="flex items-center space-x-4 mb-4">
                      <motion.div
                        className="w-12 h-12 bg-[#C5A572] rounded-full flex items-center justify-center text-white font-bold text-xl"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {testimonial.avatar}
                      </motion.div>
                      <div>
                        <p className="font-semibold text-white">{testimonial.name}</p>
                        <p className="text-sm text-blue-200">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={inView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ delay: index * 0.2 + i * 0.1 }}
                        >
                          <Star size={18} className="fill-[#C5A572] text-[#C5A572]" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-blue-100 italic leading-relaxed">"{testimonial.text}"</p>
                    <p className="text-sm text-blue-300 mt-3">{testimonial.company}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1B4B7F] mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 mb-4">
              Start free. Upgrade when you're ready.
            </p>
            <p className="text-sm text-gray-500">Cancel anytime • No hidden fees • No credit card required</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <Card className="border-2 border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 h-full">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                  <div className="text-5xl font-bold bg-gradient-to-br from-[#1B4B7F] to-blue-600 bg-clip-text text-transparent mb-2">AED 0</div>
                  <p className="text-gray-600 font-medium">Forever free</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {['10 invoices per month', 'Basic VAT tracking', 'Receipt scanning', 'VAT calculators'].map((feature, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
                    >
                      <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="secondary" className="w-full shadow-md hover:shadow-lg transition-shadow duration-300" onClick={() => setCurrentPage('register')}>
                    Start Free
                  </Button>
                </motion.div>
                <p className="text-center text-xs text-gray-500 mt-4">
                  No credit card required
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#C5A572] via-blue-500 to-[#C5A572] rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
              <Card className="border-2 border-[#C5A572] relative hover:shadow-2xl hover:shadow-[#C5A572]/30 transition-all duration-500 bg-gradient-to-br from-white via-white to-blue-50/30">
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="bg-gradient-to-r from-[#C5A572] to-[#b89960] text-white px-5 py-1.5 rounded-full text-sm font-bold flex items-center shadow-2xl border-2 border-white">
                    <Crown size={16} className="mr-1" />
                    Most Popular
                  </span>
                </motion.div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#C5A572]/8 to-blue-500/5 rounded-lg pointer-events-none"
                  animate={{ opacity: [0.4, 0.6, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative z-10">
                  <div className="text-center mb-6 pt-2">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                    <div className="text-5xl font-bold bg-gradient-to-br from-[#1B4B7F] to-blue-600 bg-clip-text text-transparent mb-2">AED 99</div>
                    <p className="text-gray-600 font-medium">per month</p>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {[
                      'Unlimited invoices',
                      'Multi-business support',
                      'Bank imports (coming soon)',
                      'Advanced VAT reports',
                      'Priority support',
                      'API access'
                    ].map((feature, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
                      >
                        <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <motion.div
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button className="w-full shadow-lg hover:shadow-xl hover:shadow-[#C5A572]/30 transition-all duration-300" onClick={() => setCurrentPage('register')}>
                      Start 14-Day Free Trial
                    </Button>
                  </motion.div>
                  <p className="text-center text-xs text-gray-500 mt-4">
                    Cancel anytime • No hidden fees • Secure payments
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-[#1B4B7F] to-[#153d6b] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C5A572] rounded-full filter blur-3xl"></div>
        </div>

        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Stop Stressing About VAT?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 5,000+ UAE freelancers and small businesses who trust Dubai Tax Assistant
          </p>
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(255,255,255,0.3)" }}
            whileTap={{ scale: 0.98 }}
          >
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 shadow-xl" onClick={() => setCurrentPage('register')}>
              Get Started Free — No Credit Card Required
              <ArrowRight size={22} />
            </Button>
          </motion.div>
          <p className="text-blue-200 mt-6 text-sm">
            ✓ Setup takes less than 10 minutes • ✓ Cancel anytime • ✓ No hidden fees
          </p>
        </motion.div>
      </section>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <motion.div
                className="flex items-center space-x-2 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <Calculator className="text-[#C5A572]" size={32} />
                <span className="text-xl font-bold">Dubai Tax Assistant</span>
              </motion.div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Your trusted partner for UAE VAT compliance. Built by freelancers, for freelancers and small businesses.
              </p>
              <p className="text-sm text-gray-500">
                support@dubaitaxassistant.com
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 mb-8">
              <p className="text-sm text-yellow-200 leading-relaxed">
                <strong>UAE VAT Compliance Disclaimer:</strong> Dubai Tax Assistant is a tool to help organize your VAT records.
                You remain responsible for the accuracy of your VAT returns and compliance with UAE Federal Tax Authority regulations.
                This tool does not provide tax advice. Consult a licensed tax professional for specific guidance.
              </p>
            </div>

            <div className="text-center text-gray-400 text-sm">
              <p>&copy; 2026 Dubai Tax Assistant. All rights reserved.</p>
              <p className="mt-2">Made with ❤️ for UAE entrepreneurs</p>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 8s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes scroll-smooth {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll-smooth {
          animation: scroll-smooth 60s linear infinite;
          will-change: transform;
        }
        .animate-scroll-smooth:hover {
          animation-play-state: paused;
        }
        .bg-grid-pattern {
          background-image:
            linear-gradient(to right, rgba(27, 75, 127, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(27, 75, 127, 0.08) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        /* Smooth scrolling optimization */
        * {
          scroll-behavior: smooth;
        }

        /* Hardware acceleration for animations */
        .animate-blob,
        .animate-scroll-smooth {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};
