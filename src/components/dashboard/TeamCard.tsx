import { Activity, Star, TrendingUp, Users } from 'lucide-react';
import Card from '../ui/Card';
import { TeamInsight } from '../../types';

interface TeamCardProps {
  team: TeamInsight;
  side: 'A' | 'B';
}

const colorA = {
  badge: 'bg-accent-red/20 text-accent-red border-accent-red/30',
  ring: 'ring-accent-red/40',
  bar: 'bg-gradient-to-r from-accent-red to-accent-orange',
  accent: 'text-accent-red',
};

const colorB = {
  badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ring: 'ring-blue-400/40',
  bar: 'bg-gradient-to-r from-blue-500 to-sky-400',
  accent: 'text-blue-400',
};

export default function TeamCard({ team, side }: TeamCardProps) {
  const c = side === 'A' ? colorA : colorB;

  const stats = [
    { label: 'Record', value: team.record ?? 'N/A' },
    { label: 'Team ERA', value: team.era ?? 'N/A' },
    { label: 'Bat. Avg', value: team.battingAvg ?? 'N/A' },
    { label: 'Slug %', value: team.slug ?? 'N/A' },
  ];

  return (
    <Card className="animate-slide-up h-full flex flex-col">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-navy-900 ring-2 ${c.ring} flex items-center justify-center text-lg font-extrabold text-white shrink-0`}>
            {team.teamName.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-white text-base leading-tight">{team.teamName}</h3>
            {team.school && <p className="text-xs text-white/45 mt-0.5">{team.school}</p>}
          </div>
        </div>
        {team.rank && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold shrink-0 ${c.badge}`}>
            <Star size={10} />
            #{team.rank}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-navy-900/80 rounded-xl p-3 text-center">
            <p className={`text-lg font-extrabold ${c.accent}`}>{s.value}</p>
            <p className="text-xs text-white/40 mt-0.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {team.draftProspects && team.draftProspects.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Users size={12} className="text-white/40" />
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
              Draft Prospects
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {team.draftProspects.map((p) => (
              <span
                key={p}
                className={`px-2.5 py-1 rounded-full border text-xs font-medium ${c.badge}`}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Activity size={12} className="text-white/40" />
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">
            AI Insight
          </p>
          <TrendingUp size={10} className={`ml-auto ${c.accent}`} />
        </div>
        <p className="text-sm text-white/70 leading-relaxed">{team.insight}</p>
      </div>
    </Card>
  );
}
