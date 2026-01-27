import React from 'react';
import { Receipt, FileText, Calculator, ArrowRight, CheckCircle, Users, TrendingUp, Shield, Zap, Clock, Check, X, Star, Play, BarChart3, Camera, DollarSign, Crown, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';

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
    { feature: 'Monthly Price', zoho: 'AED 250+', us: 'AED 99' },
    { feature: 'Ease of Use', zoho: 'Complex', us: 'Simple' },
    { feature: 'UAE VAT Focus', zoho: 'Generic', us: 'Built for UAE' },
    { feature: 'Learning Curve', zoho: '2-3 weeks', us: '10 minutes' },
    { feature: 'FTA Compliance', zoho: 'Manual setup', us: 'Built-in' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Calculator className="text-[#C5A572]" size={32} />
              <span className="text-xl font-bold text-[#1B4B7F]">Dubai Tax Assistant</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-[#1B4B7F] transition-colors font-medium">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-[#1B4B7F] transition-colors font-medium">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-[#1B4B7F] transition-colors font-medium">Reviews</a>
              <Button variant="secondary" size="sm" onClick={() => setCurrentPage('login')}>
                Login
              </Button>
              <Button size="sm" onClick={() => setCurrentPage('register')}>
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#f8fafc] via-white to-blue-50 pt-20 pb-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} />
              <span>Trusted by 5,000+ UAE Freelancers & Small Businesses</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1B4B7F] mb-6 leading-tight">
              VAT Compliance for UAE Businesses —{' '}
              <span className="text-[#C5A572]">Without Expensive Accounting Software</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Track VAT, scan receipts, generate invoices, and avoid FTA penalties — built for freelancers and small businesses in the UAE.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl" onClick={() => setCurrentPage('register')}>
                Get Started Free
                <ArrowRight size={22} />
              </Button>
              <Button variant="secondary" size="lg" className="text-lg px-8 py-6 group">
                <Play size={20} className="group-hover:scale-110 transition-transform" />
                Watch Live Demo
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
                <Shield className="text-green-600" size={20} />
                <span className="font-medium">Built for UAE VAT (FTA Compliant)</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
                <Users className="text-blue-600" size={20} />
                <span className="font-medium">5,000+ UAE Businesses</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
                <DollarSign className="text-[#C5A572]" size={20} />
                <span className="font-medium">Save AED 1,000+/year</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1B4B7F] mb-4">
              See Dubai Tax Assistant in Action
            </h2>
            <p className="text-xl text-gray-600">
              Real screens from the product — not mockups
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              {productFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 text-[#1B4B7F]">
                    {feature.icon}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{feature.text}</p>
                  </div>
                </div>
              ))}
              <Button size="lg" className="w-full mt-6" onClick={() => setCurrentPage('register')}>
                Start Using It Free <ArrowRight size={20} />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-20 blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300" style={{ transform: 'perspective(1000px) rotateY(-5deg)' }}>
                <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2 border-b border-gray-700">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-white">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">VAT Collected</p>
                      <p className="text-2xl font-bold text-green-600">AED 15,750</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">VAT Paid</p>
                      <p className="text-2xl font-bold text-red-600">AED 8,420</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Net VAT Owed</p>
                    <p className="text-3xl font-bold text-[#1B4B7F]">AED 7,330</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    {[65, 85, 45, 75].map((width, i) => (
                      <div key={i} className="h-8 bg-gray-200 rounded overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: `${width}%` }}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 overflow-hidden">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Real Screens from the Product — Not Mockups
          </p>
        </div>
        <div className="relative">
          <div className="flex space-x-6 animate-scroll">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 h-64 bg-gradient-to-br from-gray-100 to-white rounded-xl shadow-lg border border-gray-200 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-[#1B4B7F] rounded-lg flex items-center justify-center mx-auto mb-4">
                    {i % 4 === 0 && <BarChart3 className="text-white" size={32} />}
                    {i % 4 === 1 && <FileText className="text-white" size={32} />}
                    {i % 4 === 2 && <Receipt className="text-white" size={32} />}
                    {i % 4 === 3 && <Calculator className="text-white" size={32} />}
                  </div>
                  <p className="font-semibold text-gray-700">
                    {i % 4 === 0 && 'VAT Dashboard'}
                    {i % 4 === 1 && 'Invoice Generator'}
                    {i % 4 === 2 && 'Receipt Scanner'}
                    {i % 4 === 3 && 'VAT Calculator'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1B4B7F] mb-4">
              Built for Results, Not Complexity
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to stay VAT compliant without the accounting headaches
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center">
                <div className={`w-20 h-20 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#1B4B7F] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1B4B7F] mb-4">
              Is This Right for You?
            </h2>
            <p className="text-xl text-gray-600">
              Honest about who we serve best
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
                <CheckCircle className="mr-3" size={28} />
                Perfect For
              </h3>
              <ul className="space-y-4">
                {perfectFor.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center">
                <X className="mr-3" size={28} />
                Not Ideal For
              </h3>
              <ul className="space-y-4">
                {notIdealFor.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <X className="text-red-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1B4B7F] mb-4">
              Dubai Tax Assistant vs Traditional Accounting Software
            </h2>
            <p className="text-xl text-gray-600">
              Why small businesses choose us over Zoho & QuickBooks
            </p>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-6 text-gray-600 font-semibold">Feature</th>
                    <th className="text-center py-4 px-6 text-gray-600 font-semibold">Zoho / QuickBooks</th>
                    <th className="text-center py-4 px-6 bg-blue-50 text-[#1B4B7F] font-semibold">Dubai Tax Assistant</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 px-6 font-medium text-gray-900">{row.feature}</td>
                      <td className="py-4 px-6 text-center text-gray-600">{row.zoho}</td>
                      <td className="py-4 px-6 text-center bg-blue-50">
                        <span className="font-bold text-[#1B4B7F] inline-flex items-center">
                          {row.us}
                          <CheckCircle className="ml-2 text-green-600" size={18} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-gradient-to-br from-[#1B4B7F] to-[#153d6b] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Trusted by UAE Business Owners
            </h2>
            <p className="text-xl text-blue-100">
              Real reviews from real customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-[#C5A572] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-blue-200">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-[#C5A572] text-[#C5A572]" />
                  ))}
                </div>
                <p className="text-blue-100 italic leading-relaxed">"{testimonial.text}"</p>
                <p className="text-sm text-blue-300 mt-3">{testimonial.company}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1B4B7F] mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free. Upgrade when you're ready.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-5xl font-bold text-[#1B4B7F] mb-2">AED 0</div>
                <p className="text-gray-600">Forever free</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">10 invoices per month</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">Basic VAT tracking</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">Receipt scanning</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">VAT calculators</span>
                </li>
              </ul>
              <Button variant="secondary" className="w-full" onClick={() => setCurrentPage('register')}>
                Start Free
              </Button>
            </Card>

            <Card className="border-2 border-[#C5A572] relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#C5A572] text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                  <Crown size={16} className="mr-1" />
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="text-5xl font-bold text-[#1B4B7F] mb-2">AED 99</div>
                <p className="text-gray-600">per month</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700 font-medium">Unlimited invoices</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700 font-medium">Multi-business support</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700 font-medium">Bank imports (coming soon)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700 font-medium">Advanced VAT reports</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700 font-medium">Priority support</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Check className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700 font-medium">API access</span>
                </li>
              </ul>
              <Button className="w-full" onClick={() => setCurrentPage('register')}>
                Start 14-Day Free Trial
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-[#1B4B7F] to-[#153d6b]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Stop Stressing About VAT?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 5,000+ UAE freelancers and small businesses who trust Dubai Tax Assistant
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6 shadow-xl" onClick={() => setCurrentPage('register')}>
            Get Started Free — No Credit Card Required
            <ArrowRight size={22} />
          </Button>
          <p className="text-blue-200 mt-4 text-sm">
            Setup takes less than 10 minutes • Cancel anytime • No hidden fees
          </p>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Calculator className="text-[#C5A572]" size={32} />
                <span className="text-xl font-bold">Dubai Tax Assistant</span>
              </div>
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
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        .bg-grid-pattern {
          background-image:
            linear-gradient(to right, rgba(27, 75, 127, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(27, 75, 127, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
};
