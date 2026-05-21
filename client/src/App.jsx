import React, { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';


import Home from './pages/Home';
import Browse from './pages/Browse';
import SearchPage from './pages/SearchPage';
import Watch from './pages/Watch';
import SeriesDetail from './pages/SeriesDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import WatchTogetherHub from './pages/WatchTogetherHub';
import WatchTogetherCreate from './pages/WatchTogetherCreate';
import WatchRoomPage from './pages/WatchRoomPage';
import NotFound from './pages/NotFound';


const AdminLayout = React.lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = React.lazy(() => import('./admin/AdminDashboard'));
const AdminSeriesIndex = React.lazy(() => import('./admin/AdminSeriesIndex'));
const AdminSeriesNew = React.lazy(() => import('./admin/AdminSeriesNew'));
const AdminSeasonNew = React.lazy(() => import('./admin/AdminSeasonNew'));
const AdminEpisodeNew = React.lazy(() => import('./admin/AdminEpisodeNew'));
const AdminMedia = React.lazy(() => import('./admin/AdminMedia'));
const AdminUsers = React.lazy(() => import('./admin/AdminUsers'));
const AdminAnalytics = React.lazy(() => import('./admin/AdminAnalytics'));
const AdminModeration = React.lazy(() => import('./admin/AdminModeration'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  return children;
}

function AppContent() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-charcoal-950 dark:text-slate-100 transition-colors duration-300">
      {/* Light mode grid and gradient background */}
      <div className="fixed inset-0 -z-10 dark:hidden pointer-events-none bg-gradient-to-b from-white via-slate-50 to-cyan-50/20" aria-hidden />
      <div className="fixed inset-0 -z-10 dark:hidden opacity-[0.45] pointer-events-none bg-[length:24px_24px] bg-[linear-gradient(rgba(15,118,110,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(15,118,110,0.06)_1px,transparent_1px)]" aria-hidden />

      {/* Dark mode background */}
      <div
        className="hidden dark:block fixed inset-0 -z-10 pointer-events-none"
        aria-hidden
        style={{
          background: 'linear-gradient(180deg, #0c0f14 0%, #12161c 50%, #0c0f14 100%)',
        }}
      />
      <div className="hidden dark:block fixed inset-0 -z-10 opacity-[0.03] pointer-events-none bg-[length:24px_24px] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]" aria-hidden />

      {/* Ambient Glowing Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-teal-500/10 dark:bg-teal-500/5 blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-[15%] right-[-10%] w-[450px] h-[450px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-[110px] pointer-events-none -z-10" />
      <div className="fixed top-[45%] left-[-5%] w-[300px] h-[300px] rounded-full bg-indigo-500/8 dark:bg-indigo-500/3 blur-[95px] pointer-events-none -z-10" />

      <Navbar />
      <main className="flex-1 relative bg-transparent">
        <Suspense fallback={<div className="h-screen flex items-center justify-center bg-transparent"><div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/watch/:episodeId" element={<Watch />} />
            <Route path="/series/:id" element={<SeriesDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            
            {/* Watch Together Routes */}
            <Route path="/watch-together" element={<WatchTogetherHub />} />
            <Route path="/watch-together/new" element={<PrivateRoute><WatchTogetherCreate /></PrivateRoute>} />
            <Route path="/watch-together/:id" element={<WatchRoomPage />} />

            {/* Admin Routes (Lazy Loaded) */}
            <Route path="/admin" element={<PrivateRoute adminOnly><AdminLayout /></PrivateRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="series" element={<AdminSeriesIndex />} />
              <Route path="series/:id" element={<AdminSeriesNew />} />
              <Route path="seasons" element={<AdminSeasonNew />} />
              <Route path="episodes" element={<AdminEpisodeNew />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="moderation" element={<AdminModeration />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!location.pathname.startsWith('/admin') && !location.pathname.includes('/watch') && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <AppContent />
    </>
  );
}
