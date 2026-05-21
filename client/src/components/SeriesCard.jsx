import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';

export default function SeriesCard({ series, episodeId, mathProof, pearsonPredicted, history }) {
  const to = episodeId 
    ? `/watch/${episodeId}${history?.progressSeconds ? `?t=${history.progressSeconds}` : ''}` 
    : `/series/${series._id}`;

  // Calculate matching percentage if pearsonPredicted exists
  const matchPercent = pearsonPredicted ? Math.round(Math.min(100, Math.max(50, pearsonPredicted * 100))) : null;

  return (
    <Link
      to={to}
      className="group block rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-sm dark:bg-charcoal-850/40 dark:border-white/[0.06] card-hover backdrop-blur-sm dark:shadow-none relative transition-all duration-500"
    >
      <div className="aspect-[2/3] relative bg-gradient-to-b from-slate-100 to-slate-200 dark:from-charcoal-800 dark:to-charcoal-950 overflow-hidden">
        {/* Dynamic Match Label */}
        {matchPercent && (
          <div className="absolute top-3 left-3 z-30 px-2.5 py-1 rounded-xl bg-teal-500/90 text-charcoal-950 font-black text-[9px] uppercase tracking-widest shadow-md backdrop-blur-md">
            🔥 {matchPercent}% Match
          </div>
        )}

        <img
          src={`/api/assets/poster/${series._id}`}
          alt=""
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        
        {/* Soft elegant gradient shroud */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500 z-10" />
        
        {/* Central Glowing Play Button */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-12 h-12 rounded-full bg-teal-500 text-charcoal-950 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out shadow-[0_0_24px_rgba(20,184,166,0.6)]">
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24" className="translate-x-0.5">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>

        {/* Frosted Glass Footer Panel */}
        <div className="absolute bottom-0 left-0 right-0 p-3.5 bg-slate-950/70 dark:bg-charcoal-950/80 backdrop-blur-md border-t border-white/10 dark:border-white/5 z-20 transition-all duration-300">
          <h3 className="font-display font-black text-white text-xs sm:text-sm line-clamp-1 leading-snug group-hover:text-teal-300 transition-colors duration-300">
            {series.title}
          </h3>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] text-teal-400 font-extrabold tracking-wide">{series.releaseYear}</span>
            {series.status === 'completed' ? (
              <RatingStars rating={series.ratingAvg || 0} size="xs" />
            ) : (
              <span className="text-[8px] font-black uppercase tracking-wider text-teal-400/40">Ongoing</span>
            )}
          </div>
        </div>

        {/* Pulsing Watch History Indicator */}
        {history && history.durationSeconds > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
            <div 
              className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-r-sm shadow-[0_0_8px_rgba(34,211,238,0.7)] pulse-active" 
              style={{ width: `${Math.min(100, Math.max(0, (history.progressSeconds / history.durationSeconds) * 100))}%` }} 
            />
          </div>
        )}
      </div>
    </Link>
  );
}
