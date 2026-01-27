import React from 'react';
import { Receipt, FileText, Calculator, ArrowRight, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  const features = [
    {
      icon: <Receipt size={32} />,
      title: 'Never Lose a Receipt',
      description: 'Scan and store all your receipts digitally. Access them anytime, anywhere.'
    },
    {
      icon: <FileText size={32} />,
      title: 'Professional Invoices in Minutes',
      description: 'Create compliant VAT invoices with automatic calculations and beautiful templates.'
    },
    {
      icon: <Calculator size={32} />,
      title: 'Automatic VAT Calculations',
      description: 'Let us handle the math. Track VAT collected and paid automatically.'
    }
  ];

  const additionalFeatures = [
    { icon: <TrendingUp size={20} />, text: 'Real-time VAT tracking and reporting' },
    { icon: <CheckCircle size={20} />, text: 'FTA-compliant invoice generation' },
    { icon: <Users size={20} />, text: 'Access to verified tax professionals' },
    { icon: <Calculator size={20} />, text: 'Multiple VAT calculators included' }
  ];

  const testimonials = [
    {
      name: 'Ahmed Al Mansouri',
      role: 'Small Business Owner',
      text: 'This app has made VAT compliance so much easier. I can focus on growing my business instead of worrying about tax deadlines.',
      rating: 5
    },
    {
      name: 'Sarah Khan',
      role: 'Freelancer',
      text: 'The invoice generator is fantastic! Professional invoices in seconds, and the receipt scanner saves me hours of data entry.',
      rating: 5
    },
    {
      name: 'Mohammed Ali',
      role: 'Retail Shop Owner',
      text: 'Finally, a tax app that actually understands UAE VAT rules. The calculators are especially helpful for pricing my products.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Calculator className="text-[#C5A572]" size={32} />
              <span className="text-xl font-bold text-[#1B4B7F]">Dubai Tax Assistant</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-[#1B4B7F] transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-[#1B4B7F] transition-colors">Testimonials</a>
              <a href="#about" className="text-gray-600 hover:text-[#1B4B7F] transition-colors">About</a>
              <Button variant="secondary" size="sm" onClick={() => setCurrentPage('login')}>
                Login
              </Button>
              <Button size="sm" onClick={() => setCurrentPage('register')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#1B4B7F] mb-6">
            Simplify UAE VAT Compliance
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track expenses, generate invoices, and never miss a tax deadline
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={() => setCurrentPage('register')}>
              Get Started Free
              <ArrowRight size={20} />
            </Button>
            <Button variant="secondary" size="lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} hover className="text-center">
              <div className="flex justify-center mb-4 text-[#C5A572]">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#1B4B7F] mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section id="features" className="bg-[#1B4B7F] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for VAT Compliance
            </h2>
            <p className="text-xl text-blue-100">
              Powerful features designed for UAE businesses
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="text-[#C5A572]">
                  {feature.icon}
                </div>
                <span className="text-lg">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B4B7F] mb-4">
            Trusted by UAE Businesses
          </h2>
          <p className="text-xl text-gray-600">
            See what our customers have to say
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} hover>
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-[#C5A572] text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
              <div className="border-t pt-4">
                <p className="font-semibold text-[#1B4B7F]">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#1B4B7F] to-[#153d6b] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Simplify Your VAT Compliance?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of UAE businesses already using Dubai Tax Assistant
          </p>
          <Button size="lg" variant="secondary" onClick={() => setCurrentPage('register')}>
            Start Free Trial
            <ArrowRight size={20} />
          </Button>
        </div>
      </section>

      <footer id="about" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Calculator className="text-[#C5A572]" size={28} />
                <span className="text-lg font-bold">Dubai Tax Assistant</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for UAE VAT compliance
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
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
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Dubai Tax Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
