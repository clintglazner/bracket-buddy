import { useState } from 'react';
import { BookmarkCheck, GitCompare, Search, Sparkles, Volume2, VolumeX } from 'lucide-react';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import TeamCard from '../components/dashboard/TeamCard';
import MatchupCard from '../components/dashboard/MatchupCard';
import { TeamCardSkeleton, MatchupCardSkeleton } from '../components/ui/SkeletonLoader';
import { MatchupInsight, TeamInsight, User } from '../types';
import { supabase } from '../lib/supabase';

const SEARCH_SUGGESTIONS = [
  'UCLA Bruins', 'Texas Longhorns', 'North Carolina Tar Heels', 'Georgia Bulldogs',
  'Southern California Trojans', 'Nebraska Cornhuskers', 'Georgia Tech Yellow Jackets',
  'Texas A&M Aggies', 'Mississippi State Bulldogs', 'Oregon State Beavers',
  'LSU Tigers', 'Alabama Crimson Tide', 'Florida State Seminoles', 'Oregon Ducks',
  'Ole Miss Rebels', 'Arkansas Razorbacks', 'Auburn Tigers',
];

interface DashboardProps {
  user: User;
  onSignOut?: () => void;
}

type AnalysisState = 'idle' | 'loading' | 'results' | 'error';

export default function Dashboard({ user, onSignOut }: DashboardProps) {
  const [queryA, setQueryA] = useState('');
  const [queryB, setQueryB] = useState('');
  const [state, setState] = useState<AnalysisState>('idle');
  const [matchup, setMatchup] = useState<MatchupInsight | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [pinLoading, setPinLoading] = useState(false);
  const [pinned, setPinned] = useState(false);

  const playPredictionSound = () => { if (!isMuted) { const audio = new Audio('/baseballaudio.mp3'); audio.play().catch(() => {}); } }; const handleRunComparison = async () => {
    if (!queryA.trim()) return;
    setState('loading');
    setMatchup(null);
    setPinned(false);
    setErrorMsg('');

    try {
      // Step 1: Find Team A
      const { data: teamARows, error: errA } = await supabase
        .from('teams')
        .select('*')
        .or(`name.ilike.%${queryA}%,school.ilike.%${queryA}%`)
        .order('ranking', { ascending: true })
        .limit(1);

      if (errA || !teamARows?.length) {
        setState('error');
        setErrorMsg(`No team found for "${queryA}". Try: UCLA Bruins, Texas Longhorns, LSU Tigers, or Georgia Bulldogs.`);
        return;
      }
      const tA = teamARows[0];

      // Step 2: Find Team B (optional)
      let tB: any = null;
      if (queryB.trim()) {
        const { data: teamBRows } = await supabase
          .from('teams')
          .select('*')
          .or(`name.ilike.%${queryB}%,school.ilike.%${queryB}%`)
          .order('ranking', { ascending: true })
          .limit(1);
        tB = teamBRows?.[0] || null;
      }

      // Step 3: Pull batting stats from scrape_cache
      const { data: battingCache } = await supabase
        .from('scrape_cache')
        .select('raw_data')
        .eq('url', 'https://www.d1baseball.com/stats/team/batting/')
        .single();

      const battingData: any[] = battingCache?.raw_data?.batting || [];
      const battingA = battingData.find((t) => t.team_name === tA.name) || null;
      const battingB = tB ? battingData.find((t) => t.team_name === tB.name) || null : null;

      // Step 4: Call analyze Edge Function
      const analysisType = tB ? 'matchup' : 'team_preview';
      const { data: analysisData, error: analysisErr } = await supabase.functions.invoke('analyze', {
        body: {
          analysis_type: analysisType,
          subject_id: tA.id,
          subject_name: tA.name,
          ...(tB && { opponent_id: tB.id, opponent_name: tB.name }),
        },
      });

      if (analysisErr) console.warn('Edge Function error (non-fatal):', analysisErr);

      // Step 5: Get CWS futures odds
      // polymarket_odds columns: outcome, probability, market_id
      const shortNameA = tA.school || tA.name.split(' ')[0];
      const { data: oddsData } = await supabase
        .from('polymarket_odds')
        .select('outcome, probability')
        .eq('market_id', 'cws-2026-winner')
        .ilike('outcome', `%${shortNameA}%`)
        .limit(1);
      const oddsA = oddsData?.[0] || null;

      // Step 6: Build MatchupInsight
      const buildTeamInsight = (team: any, batting: any): TeamInsight => ({
        teamName: team.name,
        school: team.school || team.name,
        record: `${team.record_wins}-${team.record_losses}`,
        battingAvg: batting ? batting.avg?.toFixed(3) : undefined,
        insight: [
          `Ranked #${team.ranking} nationally`,
          `Record: ${team.record_wins}-${team.record_losses}`,
          `Conference: ${team.conference}`,
          batting ? `Team AVG: .${Math.round(batting.avg * 1000)} | ${batting.hr} HR | ${batting.runs} R` : null,
          batting ? `OBP: ${batting.obp?.toFixed(3)} | SLG: ${batting.slg?.toFixed(3)}` : null,
        ].filter(Boolean).join(' · '),
        rank: team.ranking,
      });

      const teamAInsight = buildTeamInsight(tA, battingA);
      const teamBInsight = tB ? buildTeamInsight(tB, battingB) : teamAInsight;

      let winProbA = 55;
      let winProbB = 45;
      if (tB) {
        const rankDiff = (tB.ranking || 25) - (tA.ranking || 25);
        winProbA = Math.round(Math.min(Math.max(50 + rankDiff * 1.5, 25), 75));
        winProbB = 100 - winProbA;
      }

      const result: MatchupInsight = {
        teamA: teamAInsight,
        teamB: teamBInsight,
        summary:
          analysisData?.content ||
          `${tA.name} is ranked #${tA.ranking} with a ${tA.record_wins}-${tA.record_losses} record.${
            tB ? ` ${tB.name} is ranked #${tB.ranking} at ${tB.record_wins}-${tB.record_losses}.` : ''
          }`,
        marketOdds: oddsA
          ? `${tA.name} CWS futures: ${(parseFloat(oddsA.probability) * 100).toFixed(1)}% implied probability`
          : `${tA.name} · Ranked #${tA.ranking} nationally · ${tA.conference}`,
        winProbabilityA: winProbA,
        winProbabilityB: winProbB,
        draftValueEdge: tB
          ? `#${tA.ranking} ${tA.name} vs #${tB.ranking} ${tB.name} · ${tA.conference} vs ${tB.conference}`
          : `${tA.name} · #${tA.ranking} nationally · ${tA.record_wins}-${tA.record_losses}`,
      };

      setMatchup(result);
      setState('results');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setState('error');
      setErrorMsg('Analysis failed. Please check your connection and try again.');
    }
  };

  const handlePinInsight = async () => {
    if (!matchup || pinned) return;
    setPinLoading(true);
    try {
      const { error } = await supabase.from('saved_insights').insert({
        user_email: user.email,
        user_name: user.name,
        team_a_name: matchup.teamA.teamName,
        team_b_name: matchup.teamB.teamName !== matchup.teamA.teamName ? matchup.teamB.teamName : '',
        insight_summary: matchup.summary,
        market_odds: matchup.marketOdds,
        team_a_insight: matchup.teamA.insight,
        team_b_insight: matchup.teamB.teamName !== matchup.teamA.teamName ? matchup.teamB.insight : '',
        is_pinned: true,
      });
      if (!error) setPinned(true);
      else console.error('Pin error:', error);
    } finally {
      setPinLoading(false);
    }
  };

  const [isMuted, setIsMuted] = useState(false);   const isLoading = state === 'loading';
  const hasResults = state === 'results' && matchup;
  const showTwoTeams = hasResults && matchup!.teamB.teamName !== matchup!.teamA.teamName;

  return (
    <div className="min-h-screen bg-navy-950 pb-16">
      <div className="bg-navy-900/80 border-b border-white/8 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-accent-orange" />
                <p className="text-xs text-white/50 uppercase tracking-widest font-semibold">
                  Welcome back, {user.name.split(' ')[0]}
                </p>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Analysis Dashboard</h1>
            </div>
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="text-white/30 hover:text-white/60 text-sm transition-colors"
              >
                Sign out
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <InputField
                label="Analyze First Team"
                value={queryA}
                onChange={(e) => setQueryA(e.target.value)}
                placeholder="e.g. UCLA Bruins, LSU Tigers, Texas Longhorns..."
                suggestions={SEARCH_SUGGESTIONS}
                onSuggestionClick={(v) => setQueryA(v)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunComparison()}
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Add Comparison Team"
                value={queryB}
                onChange={(e) => setQueryB(e.target.value)}
                placeholder="e.g. Georgia Bulldogs, Oregon State... (optional)"
                suggestions={SEARCH_SUGGESTIONS.filter((s) => s.toLowerCase() !== queryA.toLowerCase())}
                onSuggestionClick={(v) => setQueryB(v)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunComparison()}
              />
            </div>
            <Button
              onClick={() => { playPredictionSound(); handleRunComparison(); }}
              loading={isLoading}
              disabled={!queryA.trim() || isLoading}
              size="md"
              icon={isLoading ? undefined : <GitCompare size={16} />}
              className="shrink-0 h-[50px]"
            >
              Make Prediction</Button><button onClick={() => setIsMuted(!isMuted)} className="shrink-0 h-[50px] px-3 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors" title={isMuted ? 'Unmute sound' : 'Mute sound'}>{isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {state === 'idle' && (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mb-5 border border-white/10">
              <Search size={28} className="text-white/30" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Search for a team to begin</h3>
            <p className="text-white/40 text-sm text-center max-w-sm">
              Enter a Top 25 college baseball program above to generate AI-powered insights and betting analysis.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {SEARCH_SUGGESTIONS.slice(0, 8).map((s) => (
                <button
                  key={s}
                  onClick={() => setQueryA(s)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-navy-800 border border-white/10 text-white/60 hover:text-white hover:border-white/25 transition-all duration-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-16 h-16 bg-accent-red/15 border border-accent-red/30 rounded-full flex items-center justify-center mb-5">
              <Search size={28} className="text-accent-red/70" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
            <p className="text-white/50 text-sm text-center max-w-sm">{errorMsg}</p>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TeamCardSkeleton />
            <MatchupCardSkeleton />
            <TeamCardSkeleton />
          </div>
        )}

        {hasResults && (
          <div className="animate-fade-in space-y-6">
            <div className={`grid gap-6 ${showTwoTeams ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto'}`}>
              <TeamCard team={matchup!.teamA} side="A" />
              <MatchupCard matchup={matchup!} />
              {showTwoTeams && <TeamCard team={matchup!.teamB} side="B" />}
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <Button
                variant={pinned ? 'secondary' : 'primary'}
                onClick={handlePinInsight}
                loading={pinLoading}
                disabled={pinned}
                icon={<BookmarkCheck size={16} />}
                iconPosition="left"
              >
                {pinned ? 'Insight Pinned!' : 'Pin Insight'}
              </Button>
              {pinned && (
                <span className="text-xs text-white/40 animate-fade-in">Saved to your insights</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-16 border-t border-white/8 bg-navy-900/40 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center flex-wrap gap-8 sm:gap-14">
            {[
  { name: 'UCLA Bruins', short: 'UCLA', espnId: 26 },
  { name: 'Texas Longhorns', short: 'Texas', espnId: 251 },
  { name: 'LSU Tigers', short: 'LSU', espnId: 99 },
  { name: 'Georgia Bulldogs', short: 'Georgia', espnId: 61 },
  { name: 'Texas A&M Aggies', short: 'Texas A&M', espnId: 245 },
  { name: 'Ole Miss Rebels', short: 'Ole Miss', espnId: 145 },
].map(({ name, short, espnId }) => (
  <div key={name} className="flex flex-col items-center gap-3">
    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-navy-800 flex items-center justify-center">
      <img
        src={`https://a.espncdn.com/i/teamlogos/ncaa/500/${espnId}.png`}
        alt={name}
        className="w-full h-full object-contain p-2"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
    <span className="text-xs text-white/40 font-medium">{short}</span>
  </div>
))}
          </div>
        </div>
      </div>
    </div>
  );
}
