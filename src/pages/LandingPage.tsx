import { ArrowRight, BarChart2, GitCompare, TrendingUp, Zap, Shield, Target } from 'lucide-react';
import Button from '../components/ui/Button';
import { Page } from '../types';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

const features = [
  {
    icon: <BarChart2 size={24} className="text-accent-red" />,
    title: 'Analyze Teams & Players',
    description:
      'Deep-dive into live college baseball performance metrics. Surface patterns that traditional scouting misses with AI-powered insights.',
  },
  {
    icon: <GitCompare size={24} className="text-accent-orange" />,
    title: 'Compare Head-to-Head',
    description:
      'Run side-by-side matchup breakdowns. Understand how two programs stack up across pitching, offense, defense, and draft value.',
  },
  {
    icon: <TrendingUp size={24} className="text-accent-red" />,
    title: 'Market Intelligence',
    description:
      'Connect performance data to MLB Draft prediction markets. Find undervalued prospects before the market catches on.',
  },
];

const stats = [
  { value: '2,400+', label: 'Prospects Tracked' },
  { value: '340+', label: 'Programs Analyzed' },
  { value: '94%', label: 'Model Accuracy' },
  { value: '$1.2B', label: 'Draft Market Monitored' },
];

const marqueeTeams = [
  'LSU', 'Vanderbilt', 'Tennessee', 'Texas A&M', 'Florida', 'Wake Forest',
  'Ole Miss', 'Arkansas', 'Stanford', 'Miami', 'Virginia', 'NC State',
  'Oregon State', 'Texas', 'Arizona', 'TCU',
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-navy-950 text-white overflow-hidden">
      <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-accent-red to-accent-orange rounded-lg flex items-center justify-center shadow-glow">
            <BarChart2 size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">
            Bracket<span className="text-accent-red">Buddy</span>
          </span>
        </div>
        <Button variant="secondary" size="sm" onClick={() => onNavigate('auth')}>
          Sign In
        </Button>
      </nav>

      <section className="relative max-w-7xl mx-auto px-6 pt-12 pb-32 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent-red/8 rounded-full blur-[120px]" />
          <div className="absolute top-24 left-1/4 w-64 h-64 bg-accent-orange/6 rounded-full blur-[80px]" />
          <BaseballFieldSVG />
        </div>

        <div className="relative z-10 animate-slide-up">
          <div className="flex justify-center mb-8">
            <img
              src="/bracket-buddy-logo.jpeg"
              alt="Bracket Buddy"
              className="h-48 w-auto object-contain rounded-2xl shadow-2xl"
            />
          </div>
          <div className="inline-flex items-center gap-2 bg-accent-red/15 border border-accent-red/30 rounded-full px-4 py-1.5 text-sm text-accent-red font-semibold mb-8">
            <Zap size={13} />
            AI-Powered Draft Intelligence
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            Meet Your
            <span className="block bg-gradient-to-r from-accent-red to-accent-orange bg-clip-text text-transparent">
              Bracket Buddy
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-10">
            We built an AI analyst that connects live college baseball performance data to MLB Draft
            prediction markets — surfacing undervalued prospects before Draft Day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => onNavigate('auth')}
              icon={<ArrowRight size={18} />}
              iconPosition="right"
            >
              Start Analyzing
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => onNavigate('auth')}
              icon={<GitCompare size={18} />}
              iconPosition="left"
            >
              Compare Teams
            </Button>
          </div>
        </div>

        <div className="relative z-10 mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-accent-red to-accent-orange bg-clip-text text-transparent">
                {s.value}
              </p>
              <p className="text-xs text-white/50 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden py-6 border-y border-white/8 bg-navy-900/50">
        <div className="flex gap-8 animate-[scroll_20s_linear_infinite] whitespace-nowrap">
          {[...marqueeTeams, ...marqueeTeams].map((team, i) => (
            <span
              key={i}
              className="text-white/30 text-sm font-semibold tracking-widest uppercase shrink-0"
            >
              {team}
            </span>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Everything you need to find the edge
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Built for serious analysts, scouts, and draft market participants.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-navy-800/60 border border-white/10 rounded-2xl p-8 hover:border-white/20 hover:bg-navy-800 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-3">{f.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-gradient-to-br from-navy-800 to-navy-700 border border-white/10 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-red/5 to-accent-orange/5 rounded-3xl" />
          <div className="relative z-10">
            <div className="flex justify-center gap-4 mb-6">
              <Shield size={20} className="text-accent-red/60" />
              <Target size={20} className="text-accent-orange/60" />
              <TrendingUp size={20} className="text-accent-red/60" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Ready to find your edge?
            </h2>
            <p className="text-white/55 mb-8 max-w-md mx-auto">
              Join analysts who trust BracketBuddy to surface value before the market.
            </p>
            <Button
              size="lg"
              onClick={() => onNavigate('auth')}
              icon={<ArrowRight size={18} />}
              iconPosition="right"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/8 px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-gradient-to-br from-accent-red to-accent-orange rounded-md flex items-center justify-center">
            <BarChart2 size={12} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm">
            Bracket<span className="text-accent-red">Buddy</span>
          </span>
        </div>
        <p className="text-white/30 text-xs">
          &copy; 2024 BracketBuddy. For informational purposes only.
        </p>
      </footer>
    </div>
  );
}

function BaseballFieldSVG() {
  return (
    <svg
      viewBox="0 0 600 400"
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] opacity-5"
      fill="none"
    >
      <path d="M300 350 L50 150 L300 50 L550 150 Z" stroke="white" strokeWidth="1.5" />
      <circle cx="300" cy="350" r="8" stroke="white" strokeWidth="1.5" />
      <circle cx="50" cy="150" r="8" stroke="white" strokeWidth="1.5" />
      <circle cx="300" cy="50" r="8" stroke="white" strokeWidth="1.5" />
      <circle cx="550" cy="150" r="8" stroke="white" strokeWidth="1.5" />
      <path d="M300 350 Q180 250 50 150" stroke="white" strokeWidth="0.8" strokeDasharray="4 4" />
      <path d="M300 350 Q420 250 550 150" stroke="white" strokeWidth="0.8" strokeDasharray="4 4" />
      <circle cx="300" cy="200" r="80" stroke="white" strokeWidth="0.8" strokeDasharray="4 8" />
    </svg>
  );
}
