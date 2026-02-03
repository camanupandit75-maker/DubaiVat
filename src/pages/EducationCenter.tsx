import React, { useState, useEffect } from 'react';
import { Search, BookOpen, FileText, Calendar, AlertTriangle, Video, ArrowLeft, Clock, ChevronRight } from 'lucide-react';
import { Card } from '../components/Card';
import { 
  getEducationCategories, 
  getFeaturedArticles, 
  getArticlesByCategoryId,
  searchEducationArticles,
  getArticleBySlug 
} from '../lib/supabase';
import ReactMarkdown from 'react-markdown';

interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  article_count?: number;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  read_time_minutes: number;
  is_featured: boolean;
  is_video: boolean;
  video_url?: string;
  education_categories?: {
    name: string;
    code: string;
  };
}

export const EducationCenter: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryArticles, setCategoryArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'home' | 'category' | 'article' | 'search'>('home');

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      const [categoriesRes, featuredRes] = await Promise.all([
        getEducationCategories(),
        getFeaturedArticles()
      ]);
      
      if (categoriesRes.data) {
        setCategories(categoriesRes.data);
      }
      
      if (featuredRes.data) {
        setFeaturedArticles(featuredRes.data);
      }
      
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Load category articles when category selected
  useEffect(() => {
    if (selectedCategory) {
      const loadArticles = async () => {
        const { data } = await getArticlesByCategoryId(selectedCategory.id);
        if (data) {
          setCategoryArticles(data);
        }
      };
      loadArticles();
    }
  }, [selectedCategory]);

  // Search handler
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const search = async () => {
        const { data } = await searchEducationArticles(searchTerm);
        if (data) {
          setSearchResults(data);
          setView('search');
        }
      };
      const debounce = setTimeout(search, 300);
      return () => clearTimeout(debounce);
    } else if (searchTerm.length === 0 && view === 'search') {
      setView('home');
    }
  }, [searchTerm]);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setView('category');
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setView('article');
  };

  const handleBack = () => {
    if (view === 'article') {
      setView(selectedCategory ? 'category' : 'home');
      setSelectedArticle(null);
    } else if (view === 'category') {
      setView('home');
      setSelectedCategory(null);
    } else if (view === 'search') {
      setView('home');
      setSearchTerm('');
    }
  };

  const getCategoryIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      'BookOpen': <BookOpen className="w-6 h-6" />,
      'Book': <BookOpen className="w-6 h-6" />,
      'FileText': <FileText className="w-6 h-6" />,
      'Calendar': <Calendar className="w-6 h-6" />,
      'AlertTriangle': <AlertTriangle className="w-6 h-6" />,
      'Video': <Video className="w-6 h-6" />,
    };
    return icons[iconName] || <BookOpen className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#1B4B7F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Article View
  if (view === 'article' && selectedArticle) {
    return (
      <div className="space-y-6 pb-20 lg:pb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[#1B4B7F] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
          {selectedArticle.education_categories && (
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-4">
              {selectedArticle.education_categories.name}
            </span>
          )}
          
          <h1 className="text-2xl lg:text-3xl font-bold text-[#1B4B7F] mb-2">
            {selectedArticle.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {selectedArticle.read_time_minutes} min read
            </span>
          </div>
          
          {selectedArticle.is_video && selectedArticle.video_url && (
            <div className="mb-6 aspect-video bg-gray-100 rounded-lg">
              <iframe
                src={selectedArticle.video_url}
                className="w-full h-full rounded-lg"
                allowFullScreen
              />
            </div>
          )}
          
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({children}) => <h1 className="text-2xl font-bold text-[#1B4B7F] mt-8 mb-4">{children}</h1>,
                h2: ({children}) => <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">{children}</h2>,
                h3: ({children}) => <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">{children}</h3>,
                p: ({children}) => <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>,
                ul: ({children}) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                li: ({children}) => <li className="text-gray-700">{children}</li>,
                table: ({children}) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full border border-gray-200 rounded-lg">{children}</table>
                  </div>
                ),
                th: ({children}) => <th className="px-4 py-2 bg-gray-100 border-b text-left font-semibold">{children}</th>,
                td: ({children}) => <td className="px-4 py-2 border-b">{children}</td>,
                code: ({children}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm">{children}</code>,
                pre: ({children}) => <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-[#1B4B7F] pl-4 italic text-gray-600 my-4">{children}</blockquote>,
                hr: () => <hr className="my-6 border-gray-200" />,
                strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
              }}
            >
              {selectedArticle.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  // Category View
  if (view === 'category' && selectedCategory) {
    return (
      <div className="space-y-6 pb-20 lg:pb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[#1B4B7F] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Education Center
        </button>
        
        <div>
          <h1 className="text-2xl font-bold text-[#1B4B7F]">{selectedCategory.name}</h1>
          <p className="text-gray-600 mt-1">{selectedCategory.description}</p>
        </div>
        
        <div className="space-y-3">
          {categoryArticles.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-gray-500">No articles in this category yet.</p>
            </Card>
          ) : (
            categoryArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => handleArticleClick(article)}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-[#1B4B7F] transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{article.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{article.summary}</p>
                    <span className="text-xs text-gray-400 mt-2 inline-block">
                      {article.read_time_minutes} min read
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Search Results View
  if (view === 'search') {
    return (
      <div className="space-y-6 pb-20 lg:pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1B4B7F]">Education Center</h1>
          <p className="text-gray-600 mt-1">Learn everything about UAE VAT compliance</p>
        </div>
        
        {/* Search Box */}
        <Card>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles, guides, and tutorials..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4B7F]/20 focus:border-[#1B4B7F]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Card>
        
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            {searchResults.length} results for "{searchTerm}"
          </h2>
          
          <div className="space-y-3">
            {searchResults.map((article) => (
              <div
                key={article.id}
                onClick={() => handleArticleClick(article)}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-[#1B4B7F] transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {article.education_categories && (
                      <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded mb-2">
                        {article.education_categories.name}
                      </span>
                    )}
                    <h3 className="font-medium text-gray-900">{article.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{article.summary}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Home View
  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B4B7F]">Education Center</h1>
        <p className="text-gray-600 mt-1">Learn everything about UAE VAT compliance</p>
      </div>

      {/* Search Box */}
      <Card>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search articles, guides, and tutorials..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4B7F]/20 focus:border-[#1B4B7F]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Categories */}
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="text-[#C9A962] mb-2">
                {getCategoryIcon(category.icon)}
              </div>
              <span className="font-medium text-gray-900 text-sm text-center">{category.name}</span>
              <span className="text-xs text-gray-500">
                {category.article_count || 0} articles
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Featured Articles */}
        <div>
        <h2 className="text-lg font-semibold text-[#1B4B7F] mb-4">Featured Articles</h2>
        
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            {featuredArticles.length === 0 ? (
              <Card className="text-center py-8">
                <p className="text-gray-500">No featured articles available.</p>
              </Card>
            ) : (
              featuredArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-[#1B4B7F] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {article.education_categories && (
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded mb-2">
                          {article.education_categories.name}
                        </span>
                      )}
                      <h3 className="font-medium text-gray-900">{article.title}</h3>
                      <span className="text-xs text-gray-400 mt-2 inline-block">
                        {article.read_time_minutes} min read
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Video Tutorials Card */}
          <div className="bg-[#1B4B7F] rounded-xl p-6 text-white">
            <Video className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Video Tutorials</h3>
            <p className="text-blue-100 text-sm mb-4">
              Watch step-by-step video guides on VAT compliance
            </p>
            <button
              onClick={() => {
                const videoCategory = categories.find(c => c.code === 'video-tutorials');
                if (videoCategory) handleCategoryClick(videoCategory);
              }}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
            >
              Watch Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
