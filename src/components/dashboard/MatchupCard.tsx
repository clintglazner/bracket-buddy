import { DollarSign, Swords, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import { MatchupInsight } from '../../types';

interface MatchupCardProps {
  matchup: MatchupInsight;
}

interface KeyFactor {
  label: string;
  detail: string;
  edge: string;
}

function computeKeyFactors(matchup: MatchupInsight): KeyFactor[] {
  const { teamA, teamB } = matchup;
  const isSingleTeam = teamA.teamName === teamB.teamName;

  if (isSingleTeam) {
    const factors: KeyFactor[] = [];
    if (teamA.rank) factors.push({ label: 'National Ranking', detail: `#${teamA.rank} nationally`, edge: 'Top program' });
    if (teamA.record) factors.push({ label: 'Season Record', detail: teamA.record, edge: `${teamA.record.split('-')[0]} wins` });
    if (teamA.battingAvg && teamA.battingAvg !== 'N/A') factors.push({ label: 'Team Batting Avg', detail: teamA.battingAvg, edge: 'Offensive strength' });
    return factors.slice(0, 3);
  }

  type ScoredFactor = KeyFactor & { weight: number };
  const factors: ScoredFactor[] = [];

  const rankA = teamA.rank || 25;
  const rankB = teamB.rank || 25;
  const rankEdge = rankA <= rankB ? teamA.teamName.split(' ')[0] : teamB.teamName.split(' ')[0];
  factors.push({
    label: 'National Ranking',
    detail: `#${rankA} vs #${rankB}`,
    edge: `${rankEdge} has the edge`,
    weight: Math.abs(rankA - rankB) * 4 + 10,
  });

  if (teamA.record && teamB.record) {
    const parseRecord = (r: string) => { const [w, l] = r.split('-').map(Number); return { w: w || 0, l: l || 0 }; };
    const rA = parseRecord(teamA.record);
    const rB = parseRecord(teamB.record);
    const pctA = rA.w / (rA.w + rA.l) || 0.5;
    const pctB = rB.w / (rB.w + rB.l) || 0.5;
    const recEdge = pctA >= pctB ? teamA.teamName.split(' ')[0] : teamB.teamName.split(' ')[0];
    factors.push({
      label: 'Season Record',
      detail: `${teamA.record} vs ${teamB.record}`,
      edge: `${recEdge} has the edge`,
      weight: Math.abs(pctA - pctB) * 100 + 8,
    });
  }

  const avgA = parseFloat(teamA.battingAvg || '0');
  const avgB = parseFloat(teamB.battingAvg || '0');
  if (!isNaN(avgA) && !isNaN(avgB) && avgA > 0 && avgB > 0) {
    const batEdge = avgA >= avgB ? teamA.teamName.split(' ')[0] : teamB.teamName.split(' ')[0];
    factors.push({
      label: 'Team Batting Avg',
      detail: `${teamA.battingAvg} vs ${teamB.battingAvg}`,
      edge: `${batEdge} leads offensively`,
      weight: Math.abs(avgA - avgB) * 1000 + 6,
    });
  }

  return factors
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map(({ label, detail, edge }) => ({ label, detail, edge }));
}

export default function MatchupCard({ matchup }: MatchupCardProps) {
  const { teamA, teamB, summary, marketOdds, winProbabilityA, winProbabilityB, draftValueEdge } = matchup;
  const keyFactors = computeKeyFactors(matchup);

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

      {keyFactors.length > 0 && (
        <div className="mb-4 bg-navy-900/60 rounded-xl p-4">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
            Key Factors
          </p>
          <ul className="space-y-2.5">
            {keyFactors.map((factor, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-accent-red/20 border border-accent-red/40 flex items-center justify-center">
                  <span className="text-accent-red font-bold" style={{ fontSize: '9px' }}>{i + 1}</span>
                </span>
                <div>
                  <span className="text-xs font-semibold text-white/80">{factor.label}: </span>
                  <span className="text-xs text-white/55">{factor.detail}</span>
                  <span className="text-xs text-accent-orange"> · {factor.edge}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

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
