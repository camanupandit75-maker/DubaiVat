import React from 'react';
import { BookOpen, Video, Search, ChevronRight } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const EducationCenter: React.FC = () => {
  const categories = [
    { name: 'Getting Started', count: 8 },
    { name: 'VAT Basics', count: 12 },
    { name: 'Invoicing', count: 6 },
    { name: 'Filing Returns', count: 10 },
    { name: 'Common Mistakes', count: 7 },
    { name: 'Video Tutorials', count: 15 }
  ];

  const articles = [
    { title: 'Understanding UAE VAT: Complete Guide for Businesses', category: 'VAT Basics', readTime: '8 min' },
    { title: 'How to Create FTA-Compliant Invoices', category: 'Invoicing', readTime: '5 min' },
    { title: 'Filing Your First VAT Return: Step-by-Step', category: 'Filing Returns', readTime: '10 min' },
    { title: '10 Common VAT Mistakes and How to Avoid Them', category: 'Common Mistakes', readTime: '6 min' },
    { title: 'What is a TRN and How to Get One', category: 'Getting Started', readTime: '4 min' },
    { title: 'Zero-Rated vs Exempt Supplies Explained', category: 'VAT Basics', readTime: '7 min' }
  ];

  const glossary = [
    { term: 'TRN', definition: 'Tax Registration Number - A 15-digit unique number issued by the FTA when you register for VAT' },
    { term: 'VAT', definition: 'Value Added Tax - An indirect tax levied on most goods and services at 5% in the UAE' },
    { term: 'Input VAT', definition: 'VAT paid on purchases and expenses that can be claimed back' },
    { term: 'Output VAT', definition: 'VAT collected on sales that must be paid to the FTA' },
    { term: 'Zero-rated', definition: 'Supplies subject to 0% VAT - VAT registered but charged at 0%' },
    { term: 'Exempt', definition: 'Supplies not subject to VAT - outside the scope of VAT' },
    { term: 'Standard Rate', definition: 'The default VAT rate of 5% applied to most goods and services' },
    { term: 'FTA', definition: 'Federal Tax Authority - The government body responsible for administering VAT in the UAE' }
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1B4B7F]">Education Center</h1>
        <p className="text-gray-600 mt-1">Learn everything about UAE VAT compliance</p>
      </div>

      <Card>
        <Input placeholder="Search articles, guides, and tutorials..." icon={<Search size={20} />} />
      </Card>

      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat, i) => (
          <Card key={i} hover className="text-center cursor-pointer">
            <BookOpen className="mx-auto text-[#C5A572] mb-2" size={32} />
            <p className="font-semibold text-[#1B4B7F]">{cat.name}</p>
            <p className="text-sm text-gray-600">{cat.count} articles</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-semibold text-[#1B4B7F]">Featured Articles</h2>
          {articles.map((article, i) => (
            <Card key={i} hover className="cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 mb-2">
                    {article.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
                  <p className="text-sm text-gray-600">{article.readTime} read</p>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </div>
            </Card>
          ))}
        </div>

        <div>
          <Card className="bg-gradient-to-br from-[#1B4B7F] to-[#153d6b] text-white">
            <Video size={48} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">Video Tutorials</h3>
            <p className="text-blue-100 mb-4">Watch step-by-step video guides on VAT compliance</p>
            <Button variant="secondary">Watch Now</Button>
          </Card>
        </div>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold text-[#1B4B7F] mb-6">VAT Glossary</h2>
        <div className="space-y-3">
          {glossary.map((item, i) => (
            <details key={i} className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
              <summary className="font-semibold text-gray-900">{item.term}</summary>
              <p className="mt-2 text-gray-600">{item.definition}</p>
            </details>
          ))}
        </div>
      </Card>
    </div>
  );
};
