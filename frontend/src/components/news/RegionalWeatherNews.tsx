import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { generateLocationWeatherNews } from '../../services/weatherNewsService';
import { NewsCategory, WeatherNewsArticle } from '../../types/news';

export const RegionalWeatherNews: React.FC = () => {
  const { location, forecast, airQuality, refetchWeather } = useWeather();
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const articles = generateLocationWeatherNews(location, forecast, airQuality);

  const filteredArticles = activeCategory === 'All'
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchWeather();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const categories: NewsCategory[] = ['All', 'Advisories', 'Forecast Outlook', 'Air Quality', 'Climate'];

  const getSeverityBadge = (severity: WeatherNewsArticle['severity'], category: string) => {
    if (severity === 'watch') {
      return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    }
    if (severity === 'advisory') {
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    }
    if (category === 'Air Quality') {
      return 'bg-teal-500/15 text-teal-300 border-teal-500/30';
    }
    return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
  };

  return (
    <div className="rounded-3xl p-5 md:p-6 bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-5 select-none">
      {/* 1. Header Bar with Location Pill and Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/25 text-sky-400">
              <Newspaper className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span>Regional Weather & Climate Wire</span>
            </h2>
          </div>
          <p className="text-xs text-white/60 flex items-center gap-1.5 pl-0.5">
            <MapPin className="w-3 h-3 text-sky-400" />
            <span>Local meteorological dispatches for <strong>{location.name}</strong></span>
            {location.admin1 && <span className="text-white/40">• {location.admin1}</span>}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Live Indicator */}
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Bureau Feed
          </span>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-all active:scale-90"
            title="Refresh local news wire"
            aria-label="Refresh local news wire"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 ring-1 ring-sky-400'
                : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. News Articles List */}
      <div className="space-y-3.5">
        <AnimatePresence mode="popLayout">
          {filteredArticles.map((article) => {
            const isExpanded = expandedId === article.id;

            return (
              <motion.article
                key={article.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="p-4 md:p-5 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-sky-500/30 transition-all space-y-3"
              >
                {/* Meta row: Category badge, Published Time, Source */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(
                        article.severity,
                        article.category
                      )}`}
                    >
                      {article.category}
                    </span>
                    <span className="text-white/40 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.publishedAt}
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-white/60 truncate max-w-[220px]">
                    {article.source}
                  </span>
                </div>

                {/* Headline */}
                <h3 className="text-sm md:text-base font-bold text-white tracking-tight leading-snug">
                  {article.title}
                </h3>

                {/* Short summary */}
                <p className="text-xs text-white/70 leading-relaxed">
                  {article.summary}
                </p>

                {/* Metrics Pill Grid */}
                {article.metrics && article.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {article.metrics.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-black/25 border border-white/5 text-[11px] text-white/80"
                      >
                        <span className="text-white/40">{m.label}:</span>{' '}
                        <span className="font-semibold text-white">{m.value}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Full Meteorological Report Accordion */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="pt-2 text-xs text-slate-300 leading-relaxed border-t border-white/5 space-y-2"
                    >
                      <p className="p-3 rounded-xl bg-black/30 border border-white/5 text-white/85">
                        {article.fullReport}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-white/50 px-1">
                        <span>Report attribution: {article.source}</span>
                        <span>{article.readTime}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : article.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors pt-1"
                >
                  <span>{isExpanded ? 'Hide Briefing' : 'Read Full Dispatch'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
