import React, { useState } from 'react';
import { Search, MapPin, Star, Phone, Mail } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';

export const ProfessionalDirectory: React.FC = () => {
  const [selectedPro, setSelectedPro] = useState<any>(null);

  const professionals = [
    {
      id: 1,
      name: 'Ahmed Al Farsi',
      specialization: 'VAT Consultant',
      rating: 4.9,
      reviews: 127,
      location: 'Dubai',
      price: 'AED 500 - 1,500',
      phone: '+971 50 XXX XXXX',
      email: 'ahmed@example.com',
      services: ['VAT Registration', 'VAT Returns Filing', 'Compliance Audit'],
      description: 'Certified VAT consultant with 10+ years experience helping UAE businesses with tax compliance.'
    },
    {
      id: 2,
      name: 'Sarah Mohammed',
      specialization: 'Tax Accountant',
      rating: 4.8,
      reviews: 95,
      location: 'Abu Dhabi',
      price: 'AED 600 - 2,000',
      phone: '+971 50 YYY YYYY',
      email: 'sarah@example.com',
      services: ['Financial Accounting', 'Tax Advisory', 'Bookkeeping'],
      description: 'Expert accountant specializing in VAT and corporate tax for SMEs in the UAE.'
    },
    {
      id: 3,
      name: 'Mohammed Ali',
      specialization: 'VAT Auditor',
      rating: 5.0,
      reviews: 82,
      location: 'Dubai',
      price: 'AED 800 - 2,500',
      phone: '+971 50 ZZZ ZZZZ',
      email: 'mohammed@example.com',
      services: ['VAT Audit', 'Compliance Review', 'Risk Assessment'],
      description: 'Former FTA auditor now helping businesses ensure full VAT compliance.'
    },
    {
      id: 4,
      name: 'Fatima Hassan',
      specialization: 'Tax Consultant',
      rating: 4.7,
      reviews: 68,
      location: 'Sharjah',
      price: 'AED 450 - 1,200',
      phone: '+971 50 AAA AAAA',
      email: 'fatima@example.com',
      services: ['VAT Consultation', 'Business Setup', 'Tax Planning'],
      description: 'Helping startups and small businesses navigate UAE tax requirements.'
    },
    {
      id: 5,
      name: 'Omar Abdullah',
      specialization: 'Chartered Accountant',
      rating: 4.9,
      reviews: 143,
      location: 'Dubai',
      price: 'AED 700 - 2,200',
      phone: '+971 50 BBB BBBB',
      email: 'omar@example.com',
      services: ['Full Accounting Services', 'VAT & Tax', 'Financial Planning'],
      description: 'Complete financial services for businesses of all sizes across UAE.'
    },
    {
      id: 6,
      name: 'Laila Khalid',
      specialization: 'VAT Specialist',
      rating: 4.8,
      reviews: 91,
      location: 'Abu Dhabi',
      price: 'AED 550 - 1,800',
      phone: '+971 50 CCC CCCC',
      email: 'laila@example.com',
      services: ['VAT Training', 'Compliance Support', 'System Setup'],
      description: 'Specialized in VAT training and helping businesses set up compliant systems.'
    }
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1B4B7F]">Professional Directory</h1>
        <p className="text-gray-600 mt-1">Find verified tax professionals and consultants</p>
      </div>

      <Card>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input placeholder="Search by name or specialization..." icon={<Search size={20} />} />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:border-[#1B4B7F] focus:ring-2 focus:ring-blue-200">
            <option value="">All Services</option>
            <option>Tax Consultant</option>
            <option>Accountant</option>
            <option>Auditor</option>
            <option>VAT Specialist</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:border-[#1B4B7F] focus:ring-2 focus:ring-blue-200">
            <option value="">All Locations</option>
            <option>Dubai</option>
            <option>Abu Dhabi</option>
            <option>Sharjah</option>
            <option>Ajman</option>
          </select>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals.map((pro) => (
          <Card key={pro.id} hover>
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-[#1B4B7F] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                {pro.name.charAt(0)}
              </div>
              <h3 className="font-semibold text-lg text-[#1B4B7F]">{pro.name}</h3>
              <p className="text-sm text-gray-600">{pro.specialization}</p>
            </div>

            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(pro.rating) ? 'fill-[#C5A572] text-[#C5A572]' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{pro.rating}</span>
              <span className="text-sm text-gray-500">({pro.reviews} reviews)</span>
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-3">
              <MapPin size={16} />
              <span>{pro.location}</span>
            </div>

            <p className="text-center font-semibold text-[#C5A572] mb-4">{pro.price}</p>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => setSelectedPro(pro)}
              >
                View Profile
              </Button>
              <Button size="sm" className="flex-1">Contact</Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={!!selectedPro}
        onClose={() => setSelectedPro(null)}
        title="Professional Profile"
        size="lg"
      >
        {selectedPro && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-[#1B4B7F] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {selectedPro.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-bold text-[#1B4B7F]">{selectedPro.name}</h2>
              <p className="text-gray-600">{selectedPro.specialization}</p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.floor(selectedPro.rating) ? 'fill-[#C5A572] text-[#C5A572]' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="font-medium">{selectedPro.rating}</span>
                <span className="text-gray-500">({selectedPro.reviews} reviews)</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-600">{selectedPro.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Services Offered</h3>
              <div className="flex flex-wrap gap-2">
                {selectedPro.services.map((service: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
              <p className="text-xl font-semibold text-[#C5A572]">{selectedPro.price}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <MapPin size={20} className="text-gray-400" />
                  <span className="text-gray-700">{selectedPro.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={20} className="text-gray-400" />
                  <span className="text-gray-700">{selectedPro.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail size={20} className="text-gray-400" />
                  <span className="text-gray-700">{selectedPro.email}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1"><Phone size={18} /> Call Now</Button>
              <Button variant="secondary" className="flex-1"><Mail size={18} /> Send Email</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
