import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import AuthPageShell from '../components/AuthPageShell';
import { getAuthErrorMessage } from '../utils/authErrors';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const dismiss = toast.loading('Creating your account…');
    try {
      await register({ email, password, username });
      toast.dismiss(dismiss);
      toast.success('Account created');
      navigate('/');
    } catch (err) {
      toast.dismiss(dismiss);
      toast.error(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthPageShell>
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl p-8 sm:p-10 shadow-2xl glass-premium animate-fadeUp border border-slate-200/80 dark:border-white/[0.08]"
      >
        <div className="text-center sm:text-left mb-8">
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            Create account
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Join ClickWatch and start sharing
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="w-full px-4 py-3.5 rounded-xl bg-slate-50/50 border border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 dark:bg-charcoal-900/50 dark:border-white/[0.06] dark:text-slate-100 dark:placeholder:text-slate-500 disabled:opacity-60 transition-all text-sm"
              required
              minLength={2}
              disabled={submitting}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3.5 rounded-xl bg-slate-50/50 border border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 dark:bg-charcoal-900/50 dark:border-white/[0.06] dark:text-slate-100 dark:placeholder:text-slate-500 disabled:opacity-60 transition-all text-sm"
              required
              disabled={submitting}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Password (min 8)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 rounded-xl bg-slate-50/50 border border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 dark:bg-charcoal-900/50 dark:border-white/[0.06] dark:text-slate-100 dark:placeholder:text-slate-500 disabled:opacity-60 transition-all text-sm"
              required
              minLength={8}
              disabled={submitting}
              autoComplete="new-password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold text-sm tracking-wide shadow-md btn-glow flex items-center justify-center gap-2 min-h-[48px] border border-teal-500/20"
        >
          {submitting ? (
            <>
              <span className="inline-block h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Creating account…
            </>
          ) : (
            'Sign up'
          )}
        </button>

        <p className="text-center text-slate-500 dark:text-slate-400 text-xs mt-6 font-semibold">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthPageShell>
  );
}
