import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeContent } from '../../services/geminiService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { FiTarget, FiKey, FiList, FiSearch, FiFileText, FiAlertCircle, FiCopy, FiCheck, FiMoon, FiSun, FiArrowLeft } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const ContentAnalyzer: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [copiedSections, setCopiedSections] = useState<{ [key: string]: boolean }>({});
  const { darkMode } = useTheme();
  const { user, updateUserCoins } = useAuth();

  const ANALYSIS_COST = 10;

  const handleCopy = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSections({ ...copiedSections, [section]: true });
      setTimeout(() => {
        setCopiedSections({ ...copiedSections, [section]: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // Helper function to format section content for copying
  const formatSectionContent = (section: any, sectionType: string) => {
    switch (sectionType) {
      case 'keywords':
        return section.map((kw: any) => `${kw.word}`).join('\n');
      case 'recommendations':
        return section.join('\n');
      case 'improvements':
        return section.map((imp: any) => `${imp.priority.toUpperCase()}: ${imp.suggestion}`).join('\n');
      default:
        return Array.isArray(section) ? section.join('\n') : section;
    }
  };

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('Please enter some content to analyze');
      return;
    }

    if (!user || user.coins < ANALYSIS_COST) {
      setError('Insufficient coins. You need 10 coins to analyze content.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null); // Reset previous analysis

    try {
      console.log('Starting content analysis...');
      
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API key is missing. Please check your environment variables.');
      }

      const result = await analyzeContent(content, apiKey);
      
      // Update coins only after successful analysis
      updateUserCoins(user.coins - ANALYSIS_COST);
      
      setAnalysis(result);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze content. Please try again.');
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to safely render text content
  const renderTextContent = (content: any): string => {
    if (typeof content === 'string') return content;
    if (content && typeof content === 'object') {
      if (content.description) return content.description;
      if (content.text) return content.text;
      if (content.type && content.description) return `${content.type}: ${content.description}`;
    }
    return String(content || '');
  };

  return (
    <div className={`min-h-screen bg-${darkMode ? '[#13141a]' : 'white'} py-8`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Content Optimizer</h2>
        </div>

        {/* Text Input Area */}
        <div className="mt-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your content here to analyze..."
            className={clsx(
              "w-full min-h-[200px] p-4 rounded-lg resize-y outline-none transition-all duration-200",
              "border-2 focus:ring-2 ring-offset-2",
              darkMode 
                ? "bg-[#2c2e33] border-[#1f2024] text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20" 
                : "bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
            )}
          />
        </div>

        {/* Analyze Button */}
        <div className="mt-4">
          <button
            onClick={handleAnalyze}
            disabled={!content || isLoading || !user || user.coins < ANALYSIS_COST}
            className={clsx(
              "w-full h-[46px] py-3 px-4 rounded-lg font-medium transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
              "flex items-center justify-center gap-2",
              !content || isLoading || !user || user.coins < ANALYSIS_COST
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            )}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 min-w-[120px]">
                <LoadingSpinner className="w-4 h-4 animate-spin" />
                <span className="text-sm">Analyzing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 min-w-[120px]">
                <span>Analyze Content</span>
                <div className={clsx(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
                  darkMode 
                    ? "bg-[#1f2024] text-gray-300" 
                    : "bg-blue-600/20 text-white"
                )}>
                  <FiMoon className="w-3.5 h-3.5" />
                  <span>10</span>
                </div>
              </div>
            )}
          </button>
          <div className={clsx(
            "mt-2 text-sm text-center",
            darkMode ? "text-gray-400" : "text-gray-600"
          )}>
            Available Coins: {user?.coins || 0}
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        {analysis && (
          <div className="space-y-6 mt-8">
            {/* Analysis Sections Container */}
            <div className={clsx(
              "rounded-lg p-6 space-y-6",
              darkMode ? "bg-[#1a1b1e]" : "bg-gray-50"
            )}>
              {/* Target Keyword */}
              <div className={`${darkMode ? 'bg-[#2c2e33]' : 'bg-white shadow-md'} rounded-lg p-4 relative`}>
                <div className="flex items-center gap-2 mb-4">
                  <FiTarget className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-semibold">Target Keyword</h2>
                </div>
                <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {analysis.keywords.main[0]?.word}
                </div>
              </div>

              {/* Main Keywords */}
              <div className={`${darkMode ? 'bg-[#2c2e33]' : 'bg-white shadow-md'} rounded-lg p-4 relative`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FiKey className="w-5 h-5 text-blue-500" /> Main Keywords
                  </h2>
                  <button 
                    className={clsx(
                      "p-1 transition-colors",
                      darkMode 
                        ? "text-gray-400 hover:text-blue-400" 
                        : "text-gray-600 hover:text-blue-600"
                    )}
                    onClick={() => handleCopy(formatSectionContent(analysis.keywords.main, 'keywords'), 'mainKeywords')}
                  >
                    {copiedSections['mainKeywords'] ? 
                      <FiCheck className="w-5 h-5 text-green-400" /> : 
                      <FiCopy className="w-5 h-5" />
                    }
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.main.map((keyword: any, i: number) => (
                    <span
                      key={i}
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        darkMode
                          ? 'bg-[#1f2024] text-gray-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {keyword.word}
                    </span>
                  ))}
                </div>
              </div>

              {/* LSI Keywords */}
              <div className={`${darkMode ? 'bg-[#2c2e33]' : 'bg-white shadow-md'} rounded-lg p-4 relative`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FiList className="w-5 h-5 text-blue-500" /> LSI Keywords
                  </h2>
                  <button 
                    className={clsx(
                      "p-1 transition-colors",
                      darkMode 
                        ? "text-gray-400 hover:text-blue-400" 
                        : "text-gray-600 hover:text-blue-600"
                    )}
                    onClick={() => handleCopy(formatSectionContent(analysis.keywords.lsi, 'keywords'), 'lsiKeywords')}
                  >
                    {copiedSections['lsiKeywords'] ? 
                      <FiCheck className="w-5 h-5 text-green-400" /> : 
                      <FiCopy className="w-5 h-5" />
                    }
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.lsi.map((keyword: any, i: number) => (
                    <span
                      key={i}
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        darkMode
                          ? 'bg-[#1f2024] text-gray-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {keyword.word}
                    </span>
                  ))}
                </div>
              </div>

              {/* SEO Analysis Section */}
              <div className={`${darkMode ? 'bg-[#2c2e33]' : 'bg-white shadow-md'} rounded-lg p-4 relative`}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <FiSearch className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-semibold">SEO Analysis</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={darkMode ? "text-gray-400" : "text-gray-700"}>Score:</span>
                    <span className={clsx(
                      "px-2 py-0.5 text-sm rounded-md font-medium",
                      analysis.seo.score >= 80 ? 
                        darkMode ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : 
                        "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                      analysis.seo.score >= 60 ? 
                        darkMode ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : 
                        "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                      darkMode ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : 
                      "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    )}>
                      {analysis.seo.score}
                    </span>
                  </div>
                </div>

                {/* SEO Recommendations */}
                <div className="mb-4">
                  <h5 className={clsx(
                    "text-sm font-medium",
                    darkMode ? "text-gray-400" : "text-gray-700"
                  )}>
                    Recommendations
                  </h5>
                  <ul className="list-disc list-inside text-gray-400 space-y-2">
                    {analysis.seo?.recommendations?.map((recommendation: string, i: number) => (
                      <li key={i} className={darkMode ? "text-gray-300" : "text-gray-900"}>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Content Gaps */}
                <div className="mb-4">
                  <h5 className={clsx(
                    "text-sm font-medium",
                    darkMode ? "text-gray-400" : "text-gray-700"
                  )}>
                    Content Gaps
                  </h5>
                  
                  {/* Missing Topics */}
                  <div className="mb-3">
                    <h6 className={clsx(
                      "text-sm",
                      darkMode ? "text-gray-500" : "text-gray-700"
                    )}>
                      Missing Topics
                    </h6>
                    <ul className="list-disc list-inside text-gray-400 space-y-2">
                      {analysis.seo?.contentGaps?.missingTopics?.map((topic: string, i: number) => (
                        <li key={i} className={darkMode ? "text-gray-300" : "text-gray-900"}>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Competitor Keywords */}
                  <div>
                    <h6 className={clsx(
                      "text-sm",
                      darkMode ? "text-gray-500" : "text-gray-700"
                    )}>
                      Competitor Keywords
                    </h6>
                    <div className="flex flex-wrap gap-2">
                      {analysis.seo?.contentGaps?.competitorKeywords?.map((keyword: string, i: number) => (
                        <span
                          key={i}
                          className={clsx(
                            "px-3 py-1 rounded-full text-sm",
                            darkMode 
                              ? "bg-[#2c2e33] text-gray-300" 
                              : "bg-gray-100 text-gray-700"
                          )}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Title Optimization */}
                <div>
                  <h5 className={clsx(
                    "text-sm font-medium",
                    darkMode ? "text-gray-400" : "text-gray-700"
                  )}>
                    Title Optimization
                  </h5>
                  <div className="space-y-3">
                    <div>
                      <h6 className={clsx(
                        "text-sm",
                        darkMode ? "text-gray-500" : "text-gray-700"
                      )}>
                        Current Title
                      </h6>
                      <p className={clsx(
                        "p-2 rounded",
                        darkMode ? "bg-[#1a1b1e] text-gray-300" : "bg-white text-gray-900"
                      )}>
                        {analysis.seo?.titleOptimization?.current}
                      </p>
                    </div>
                    <div>
                      <h6 className={clsx(
                        "text-sm",
                        darkMode ? "text-gray-500" : "text-gray-700"
                      )}>
                        Suggested Titles
                      </h6>
                      <ul className="space-y-2">
                        {analysis.seo?.titleOptimization?.suggestions?.map((title: string, i: number) => (
                          <li key={i} className={clsx(
                            "p-2 rounded",
                            darkMode ? "bg-[#1a1b1e] text-gray-300" : "bg-white text-gray-900"
                          )}>
                            {title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEO Recommendations */}
              <div className={`${darkMode ? 'bg-[#2c2e33]' : 'bg-white shadow-md'} rounded-lg p-4 relative`}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <FiSearch className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-semibold">SEO Recommendations</h2>
                  </div>
                  <button 
                    className={clsx(
                      "p-1 transition-colors",
                      darkMode 
                        ? "text-gray-400 hover:text-blue-400" 
                        : "text-gray-600 hover:text-blue-600"
                    )}
                    onClick={() => handleCopy(formatSectionContent(analysis.seo.recommendations, 'recommendations'), 'seoRecommendations')}
                  >
                    {copiedSections['seoRecommendations'] ? 
                      <FiCheck className="w-5 h-5 text-green-400" /> : 
                      <FiCopy className="w-5 h-5" />
                    }
                  </button>
                </div>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  <li>Include a meta description that summarizes the content</li>
                  <li>Use target keyword in the title, headings, and first 100 words</li>
                  <li>Optimize images with alt text</li>
                  <li>Use internal and external links</li>
                  <li>Ensure fast page load times</li>
                  <li>Use a responsive design</li>
                  <li>Enhance content readability</li>
                </ul>
              </div>

              {/* Content Structure */}
              <div className={`${darkMode ? 'bg-[#2c2e33]' : 'bg-white shadow-md'} rounded-lg p-4 relative`}>
                <div className="flex items-center gap-2 mb-4">
                  <FiFileText className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-semibold">Content Structure</h2>
                </div>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  {analysis.structure.headings.h1.concat(
                    analysis.structure.headings.h2,
                    analysis.structure.headings.h3
                  ).map((heading: string, i: number) => (
                    <li key={i} className={darkMode ? "text-gray-300" : "text-gray-900"}>
                      {heading}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Content Gaps */}
              <div className={`${darkMode ? 'bg-[#2c2e33]' : 'bg-white shadow-md'} rounded-lg p-4 relative`}>
                <div className="flex items-center gap-2 mb-4">
                  <FiAlertCircle className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-semibold">Content Gaps</h2>
                </div>
                <ul className="list-disc list-inside text-gray-400 space-y-2">
                  {analysis.seo.contentGaps.missingTopics.map((topic: string, i: number) => (
                    <li key={i} className={darkMode ? "text-gray-300" : "text-gray-900"}>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvement Suggestions */}
              <div className={`${darkMode ? 'bg-[#2c2e33]' : 'bg-white shadow-md'} rounded-lg p-4 relative`}>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <FiFileText className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-semibold">Improvement Suggestions</h2>
                  </div>
                  <button 
                    className={clsx(
                      "p-1 transition-colors",
                      darkMode 
                        ? "text-gray-400 hover:text-blue-400" 
                        : "text-gray-600 hover:text-blue-600"
                    )}
                    onClick={() => handleCopy(formatSectionContent(analysis.improvementSuggestions.content, 'improvements'), 'improvements')}
                  >
                    {copiedSections['improvements'] ? 
                      <FiCheck className="w-5 h-5 text-green-400" /> : 
                      <FiCopy className="w-5 h-5" />
                    }
                  </button>
                </div>
                
                {/* Content Improvements */}
                <div className="mb-4">
                  <h5 className={clsx(
                    "text-sm font-medium",
                    darkMode ? "text-gray-400" : "text-gray-700"
                  )}>
                    Content Improvements
                  </h5>
                  <ul className="list-disc list-inside text-gray-400 space-y-2">
                    {analysis.improvementSuggestions?.content?.map((suggestion: any, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className={clsx(
                          "px-2 py-0.5 text-xs rounded-md font-medium",
                          suggestion.priority === 'high' ? 
                            darkMode ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : 
                            "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
                          suggestion.priority === 'medium' ? 
                            darkMode ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : 
                            "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                          darkMode ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : 
                          "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        )}>
                          {suggestion.priority}
                        </span>
                        <span className={darkMode ? "text-gray-300" : "text-gray-900"}>
                          {suggestion.suggestion}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Style Improvements */}
                <div className="mb-4">
                  <h5 className={clsx(
                    "text-sm font-medium",
                    darkMode ? "text-gray-400" : "text-gray-700"
                  )}>
                    Style Improvements
                  </h5>
                  <ul className="list-disc list-inside text-gray-400 space-y-2">
                    {analysis.improvementSuggestions?.style?.map((suggestion: any, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className={clsx(
                          "px-2 py-0.5 text-xs rounded-md font-medium",
                          suggestion.priority === 'high' ? 
                            darkMode ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : 
                            "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
                          suggestion.priority === 'medium' ? 
                            darkMode ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : 
                            "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                          darkMode ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : 
                          "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        )}>
                          {suggestion.priority}
                        </span>
                        <span className={darkMode ? "text-gray-300" : "text-gray-900"}>
                          {suggestion.suggestion}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* SEO Improvements */}
                <div>
                  <h5 className={clsx(
                    "text-sm font-medium",
                    darkMode ? "text-gray-400" : "text-gray-700"
                  )}>
                    SEO Improvements
                  </h5>
                  <ul className="list-disc list-inside text-gray-400 space-y-2">
                    {analysis.improvementSuggestions?.seo?.map((suggestion: any, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className={clsx(
                          "px-2 py-0.5 text-xs rounded-md font-medium",
                          suggestion.priority === 'high' ? 
                            darkMode ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : 
                            "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
                          suggestion.priority === 'medium' ? 
                            darkMode ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : 
                            "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                          darkMode ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : 
                          "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        )}>
                          {suggestion.priority}
                        </span>
                        <span className={darkMode ? "text-gray-300" : "text-gray-900"}>
                          {suggestion.suggestion}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* General Improvements Section */}
              <div className={`${darkMode ? 'bg-[#2c2e33]' : 'bg-white shadow-md'} rounded-lg p-4 relative`}>
                <div className="flex items-center gap-2 mb-4">
                  <FiFileText className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-semibold">General Improvements</h2>
                </div>

                {/* Priority Improvements */}
                <div className="mb-4">
                  <h5 className={clsx(
                    "text-sm font-medium",
                    darkMode ? "text-gray-400" : "text-gray-700"
                  )}>
                    Priority Improvements
                  </h5>
                  <ul className="list-disc list-inside text-gray-400 space-y-2">
                    {analysis.improvements?.priority?.map((improvement: string, i: number) => (
                      <li key={i} className={darkMode ? "text-gray-300" : "text-gray-900"}>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Additional Improvements */}
                <div>
                  <h5 className={clsx(
                    "text-sm font-medium",
                    darkMode ? "text-gray-400" : "text-gray-700"
                  )}>
                    Additional Improvements
                  </h5>
                  <ul className="list-disc list-inside text-gray-400 space-y-2">
                    {analysis.improvements?.additional?.map((improvement: string, i: number) => (
                      <li key={i} className={darkMode ? "text-gray-300" : "text-gray-900"}>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { ContentAnalyzer };
