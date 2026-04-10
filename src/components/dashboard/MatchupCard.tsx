import { DollarSign, Swords, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import { MatchupInsight } from '../../types';

interface MatchupCardProps {
  matchup: MatchupInsight;
}

export default function MatchupCard({ matchup }: MatchupCardProps) {
  const { teamA, teamB, summary, marketOdds, winProbabilityA, winProbabilityB, draftValueEdge } =
    matchup;

  return (
    <Card variant="highlight" className="animate-slide-up h-full flex flex-col">
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent-red/40" />
        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-red/15 rounded-full border border-accent-red/30">
          <Swords size={13} className="text-accent-red" />
          <span className="text-accent-red font-bold text-sm">Matchup Breakdown</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent-red/40" />
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="text-center flex-1">
          <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">Team A</p>
          <p className="font-bold text-white text-sm leading-tight">{teamA.teamName}</p>
        </div>
        <div className="px-4 py-1.5 bg-navy-900 rounded-full border border-white/10">
          <span className="text-white/40 font-bold text-xs tracking-widest">VS</span>
        </div>
        <div className="text-center flex-1">
          <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">Team B</p>
          <p className="font-bold text-white text-sm leading-tight">{teamB.teamName}</p>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex justify-between text-xs text-white/50 mb-1.5">
          <span className="font-semibold text-accent-red">{winProbabilityA}%</span>
          <span className="font-medium uppercase tracking-widest">Win Probability</span>
          <span className="font-semibold text-blue-400">{winProbabilityB}%</span>
        </div>
        <div className="h-2.5 bg-navy-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-red to-accent-orange rounded-full transition-all duration-700"
            style={{ width: `${winProbabilityA}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-white/35 truncate max-w-[45%]">{teamA.teamName.split(' ')[0]}</span>
          <span className="text-xs text-white/35 truncate max-w-[45%] text-right">{teamB.teamName.split(' ')[0]}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
          Comparison Summary
        </p>
        <p className="text-sm text-white/70 leading-relaxed">{summary}</p>
      </div>

      <div className="bg-navy-900/80 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={13} className="text-accent-orange" />
          <p className="text-xs font-semibold text-accent-orange uppercase tracking-widest">
            Market Odds Insight
          </p>
        </div>
        <p className="text-sm text-white/65 leading-relaxed">{marketOdds}</p>
      </div>

      <div className="bg-gradient-to-r from-accent-red/10 to-accent-orange/10 border border-accent-red/25 rounded-xl p-4 mt-auto">
        <div className="flex items-center gap-2 mb-1.5">
          <DollarSign size={13} className="text-accent-red" />
          <p className="text-xs font-bold text-accent-red uppercase tracking-widest">Draft Value Edge</p>
        </div>
        <p className="text-sm text-white/80 font-semibold">{draftValueEdge}</p>
      </div>
    </Card>
  );
}
