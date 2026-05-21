import { useEffect, useState } from 'react';
import api from '../api/client';
import SeriesCard from '../components/SeriesCard';
import { RowSkeleton } from '../components/Skeleton';
import SectionHeader from '../components/SectionHeader';
import EmptyState from '../components/EmptyState';

export default function Browse() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await api.get('/series', { params: { page, limit: 24, genre: genre || undefined, sort } });
      if (!cancelled) {
        setItems((prev) => (page === 1 ? data.items || [] : [...prev, ...(data.items || [])]));
        setTotal(data.total || 0);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, genre, sort]);

  return (
    <div className="w-full px-8 sm:px-12 md:px-16 lg:px-20 py-10 sm:py-12">
      <SectionHeader
        title="Browse"
        subtitle={total ? `${total} titles in your library` : 'Explore everything you’ve added'}
      />
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl glass-premium border border-slate-200/60 dark:border-white/[0.08] mb-10 shadow-lg shadow-slate-100/50 dark:shadow-black/20 animate-fadeUp">
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </span>
          <input
            placeholder="Filter by genre"
            value={genre}
            onChange={(e) => {
              setPage(1);
              setGenre(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200/80 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 dark:bg-charcoal-900/50 dark:border-white/[0.06] dark:text-white dark:placeholder:text-slate-500 transition-all"
          />
        </div>
        
        <div className="relative min-w-[160px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16"/>
            </svg>
          </span>
          <select
            value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value);
            }}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50/50 border border-slate-200/80 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 dark:bg-charcoal-900/50 dark:border-white/[0.06] dark:text-slate-200 dark:focus:bg-charcoal-950 transition-all appearance-none cursor-pointer"
          >
            <option value="newest" className="dark:bg-charcoal-900">Newest</option>
            <option value="popular" className="dark:bg-charcoal-900">Popular</option>
            <option value="rating" className="dark:bg-charcoal-900">Top Rated</option>
          </select>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400 dark:text-slate-500">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </span>
        </div>
      </div>
      {loading ? (
        <RowSkeleton n={12} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No series found"
          description="Try clearing the genre filter or add new content from the admin panel."
          icon="🔍"
          actionLabel="Back to home"
          actionTo="/"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 animate-fadeUp">
          {items.map((s) => (
            <SeriesCard key={s._id} series={s} />
          ))}
        </div>
      )}
      {!loading && page * 24 < total && (
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          className="mt-10 w-full py-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold tracking-wide shadow-sm hover:shadow-md transition-all duration-300 dark:border-white/[0.08] dark:bg-white/[0.02] dark:hover:bg-white/[0.06] dark:text-slate-200 btn-glow"
        >
          Load more
        </button>
      )}
    </div>
  );
}
