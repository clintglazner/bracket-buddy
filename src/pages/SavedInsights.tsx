import { useEffect, useState } from 'react';
import { Bookmark, BookmarkX, ChevronDown, ChevronUp, Clock, Swords, TrendingUp } from 'lucide-react';
import { SavedInsight, User } from '../types';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';

interface SavedInsightsProps {
  user: User;
}

function InsightCard({ insight, onDelete }: { insight: SavedInsight; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase.from('saved_insights').delete().eq('id', insight.id);
    if (!error) onDelete(insight.id);
    else setDeleting(false);
  };

  const formattedDate = new Date(insight.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const hasBothTeams = insight.team_b_name && insight.team_b_name !== insight.team_a_name;

  return (
    <div className="bg-navy-800 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20 animate-slide-up">
      <div
        className="p-5 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-br from-accent-red to-accent-orange rounded-md flex items-center justify-center shrink-0">
                <Swords size={12} className="text-white" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-sm">{insight.team_a_name}</span>
                {hasBothTeams && (
                  <>
                    <span className="text-white/30 text-xs font-bold">vs</span>
                    <span className="font-bold text-white text-sm">{insight.team_b_name}</span>
                  </>
                )}
              </div>
            </div>
            <p className="text-white/55 text-xs leading-relaxed line-clamp-2">
              {insight.insight_summary}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-1 text-white/30">
              <Clock size={11} />
              <span className="text-xs">{formattedDate}</span>
            </div>
            {expanded ? (
              <ChevronUp size={15} className="text-white/40" />
            ) : (
              <ChevronDown size={15} className="text-white/40" />
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/8 p-5 space-y-4 animate-fade-in">
          {insight.team_a_insight && (
            <div>
              <p className="text-xs font-semibold text-accent-red uppercase tracking-widest mb-1.5">
                {insight.team_a_name} Insight
              </p>
              <p className="text-sm text-white/65 leading-relaxed">{insight.team_a_insight}</p>
            </div>
          )}

          {hasBothTeams && insight.team_b_insight && (
            <div>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1.5">
                {insight.team_b_name} Insight
              </p>
              <p className="text-sm text-white/65 leading-relaxed">{insight.team_b_insight}</p>
            </div>
          )}

          <div className="bg-navy-900/80 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <TrendingUp size={13} className="text-accent-orange" />
              <p className="text-xs font-semibold text-accent-orange uppercase tracking-widest">
                Market Odds
              </p>
            </div>
            <p className="text-sm text-white/65 leading-relaxed">{insight.market_odds}</p>
          </div>

          <div className="flex justify-end">
            <Button
              variant="danger"
              size="sm"
              loading={deleting}
              onClick={handleDelete}
              icon={<BookmarkX size={14} />}
              iconPosition="left"
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SavedInsights({ user }: SavedInsightsProps) {
  const [insights, setInsights] = useState<SavedInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('saved_insights')
        .select('*')
        .eq('user_email', user.email)
        .order('created_at', { ascending: false });
      setInsights(data ?? []);
      setLoading(false);
    };
    fetchInsights();
  }, [user.email]);

  const handleDelete = (id: string) => {
    setInsights((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-navy-950 pb-16">
      <div className="bg-navy-900/80 border-b border-white/8 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-red to-accent-orange rounded-lg flex items-center justify-center shadow-glow">
              <Bookmark size={15} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Saved Insights</h1>
          </div>
          <p className="text-white/45 text-sm mt-1">
            Your pinned matchup breakdowns and analysis.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-navy-800 border border-white/10 rounded-2xl p-5 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-white/10 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded-lg w-1/3" />
                    <div className="h-3 bg-white/10 rounded-lg w-full" />
                    <div className="h-3 bg-white/10 rounded-lg w-4/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && insights.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="w-16 h-16 bg-navy-800 rounded-full flex items-center justify-center mb-5 border border-white/10">
              <Bookmark size={28} className="text-white/25" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No saved insights yet</h3>
            <p className="text-white/40 text-sm text-center max-w-sm">
              Run a comparison in the Dashboard and click "Pin Insight" to save your best analyses here.
            </p>
          </div>
        )}

        {!loading && insights.length > 0 && (
          <div className="space-y-4">
            <p className="text-xs text-white/40 font-medium">
              {insights.length} saved insight{insights.length !== 1 ? 's' : ''}
            </p>
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
