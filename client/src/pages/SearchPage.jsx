import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import SectionHeader from '../components/SectionHeader';
import SeriesCard from '../components/SeriesCard';
import Spinner from '../components/Spinner';
import { toast } from 'sonner';

function useDebounced(value, delay) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  
  const [q, setQ] = useState(initialQ);
  const debounced = useDebounced(q, 350);
  const [results, setResults] = useState({ series: [], isSearch: false });
  const [loading, setLoading] = useState(false);

  const unifiedInputRef = useRef(null);

  useEffect(() => {
    if (debounced.trim()) {
      setSearchParams({ q: debounced }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [debounced, setSearchParams]);

  const isResultsMode = !!q.trim();

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (unifiedInputRef.current) {
      unifiedInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        unifiedInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSupported = !!SpeechRecognition;

  const toggleListening = () => {
    if (!isSupported) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          toast.error('Microphone access was denied. Please check your browser microphone permissions.');
        } else if (event.error === 'no-speech') {
          toast.error('No speech detected. Please speak clearly into your microphone.');
        } else if (event.error === 'network') {
          toast.error("Speech recognition network error. Ensure you have a stable internet connection and are using Google Chrome (which hosts the browser's speech recognition cloud servers).");
        } else {
          toast.error(`Speech recognition failed: ${event.error || 'unknown error'}`);
        }
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQ(transcript);
        setIsListening(false);
      };
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition', err);
      toast.error('Failed to start speech recognition.');
    }
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/search', { params: { q: debounced } });
        if (!cancelled) setResults(data);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [debounced]);

  const clearSearch = () => {
    setQ('');
  };

  return (
    <div className="w-full px-8 sm:px-12 md:px-16 lg:px-20 py-10 sm:py-20 min-h-[90vh]">
      <div className="max-w-4xl mx-auto flex flex-col items-center mb-16 relative">
        
        <div className={`w-full transition-all duration-700 ease-in-out font-display ${isResultsMode ? 'opacity-0 -translate-y-10 scale-90 pointer-events-none absolute' : 'opacity-100 translate-y-0 scale-100 mb-12'}`}>
          <SectionHeader 
            title="Explore Content" 
            subtitle="Discover trends, search titles, and find your next favorite series." 
          />
        </div>

        {isResultsMode && (
          <div className="text-center w-full animate-in fade-in slide-in-from-top-6 duration-700 mb-10">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-4">
              <span className="w-1.5 h-10 rounded-full bg-teal-500 shadow-[0_0_15px_-2px_rgba(20,184,166,0.5)]" />
              {results.matchFound ? (
                <>Results for <span className="text-teal-600 dark:text-teal-400">"{q}"</span></>
              ) : (
                <>Exploring <span className="text-slate-400">"{q}"</span></>
              )}
            </h1>
            {results.matchFound && (
              <p className="text-sm font-medium text-slate-500 mt-3 tracking-wide">{results.series.length} matches found</p>
            )}
          </div>
        )}

        <div className={`relative group w-full transition-all duration-500 ease-in-out ${isResultsMode ? 'max-w-xl translate-y-0' : 'max-w-2xl translate-y-0'}`}>
          <input
            ref={unifiedInputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={isListening ? 'Listening…' : 'Explore series, genres, or tags…'}
            className={`w-full transition-all duration-500 outline-none border shadow-lg font-medium
              ${isResultsMode 
                ? 'px-5 py-2.5 pl-12 pr-24 rounded-2xl text-base bg-white border-slate-200 focus:border-teal-500 focus:shadow-teal-500/10 dark:bg-charcoal-900 dark:border-white/10 dark:text-white dark:placeholder:text-slate-500 placeholder:font-normal'
                : 'px-6 py-3.5 pl-14 pr-28 rounded-2xl text-lg bg-white border-slate-200 focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/10 dark:bg-charcoal-850 dark:border-white/5 dark:text-white placeholder:font-normal dark:placeholder:text-slate-700'
              }`}
          />
          
          <div className={`absolute top-1/2 -translate-y-1/2 text-slate-400 transition-all duration-500 group-focus-within:text-teal-500 ${isResultsMode ? 'left-4 scale-95' : 'left-5 scale-100'}`}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          
          <div className={`absolute top-1/2 -translate-y-1/2 flex items-center transition-all duration-500 ${isResultsMode ? 'right-3 gap-1' : 'right-4 gap-2'}`}>
            {q && (
              <button 
                onClick={clearSearch} 
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-full transition-all duration-300"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            )}
            
            {isSupported && (
               <button
                 type="button"
                 onClick={toggleListening}
                 className={`flex items-center justify-center rounded-xl transition-all duration-300 ${
                   isListening 
                     ? 'bg-rose-500 text-white shadow-lg animate-pulse scale-105' 
                     : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
                 } ${isResultsMode ? 'w-8 h-8' : 'w-10 h-10'}`}
               >
                 <svg width={isResultsMode ? 16 : 20} height={isResultsMode ? 16 : 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
               </button>
            )}
          </div>
        </div>
      </div>

      {isResultsMode && !results.matchFound && (
         <div className="mb-14 text-center py-12 px-6 bg-slate-50 dark:bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10 animate-fadeUp">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight mb-2">Finding your next favorite</h2>
            <p className="text-sm font-medium text-slate-500">We couldn't find exactly what you're looking for. <br/> Check out some of these top-rated picks instead.</p>
         </div>
      )}

      {!isResultsMode && (
        <div className="mb-10 flex items-center gap-4 animate-fadeUp">
          <span className="w-2 h-8 rounded-full bg-teal-500 shadow-[0_0_15px_-3px_rgba(20,184,166,0.5)]" />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Trending Now</h2>
          {loading && <Spinner size="sm" />}
        </div>
      )}

      <div className="animate-fadeUp">
        {results.series?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-10">
            {results.series.map((s) => (
              <SeriesCard key={s._id} series={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}








