import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import { User } from './types';

type AppState = 'loading' | 'landing' | 'auth' | 'dashboard';

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          name: session.user.user_metadata?.name ?? session.user.email ?? 'User',
        });
        setAppState('dashboard');
      } else {
        setAppState('landing');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          name: session.user.user_metadata?.name ?? session.user.email ?? 'User',
        });
        setAppState('dashboard');
      } else {
        setUser(null);
        setAppState('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAppState('landing');
  };

  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (appState === 'landing') {
    return <LandingPage onGetStarted={() => setAppState('auth')} />;
  }

  if (appState === 'auth') {
    return (
      <AuthPage
        onAuth={(u) => {
          setUser(u);
          setAppState('dashboard');
        }}
        onBack={() => setAppState('landing')}
      />
    );
  }

  return <Dashboard user={user!} onSignOut={handleSignOut} />;
}
