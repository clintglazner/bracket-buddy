export type Page = 'landing' | 'auth' | 'dashboard' | 'saved';

export interface User {
  name: string;
  email: string;
}

export interface TeamInsight {
  teamName: string;
  school?: string;
  record?: string;
  era?: string;
  battingAvg?: string;
  slug?: string;
  draftProspects?: string[];
  insight: string;
  rank?: number;
}

export interface MatchupInsight {
  teamA: TeamInsight;
  teamB: TeamInsight;
  summary: string;
  marketOdds: string;
  winProbabilityA: number;
  winProbabilityB: number;
  draftValueEdge: string;
}

export interface SavedInsight {
  id: string;
  user_email: string;
  user_name: string;
  team_a_name: string;
  team_b_name: string;
  insight_summary: string;
  market_odds: string;
  team_a_insight: string;
  team_b_insight: string;
  is_pinned: boolean;
  created_at: string;
}
