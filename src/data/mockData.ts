import { TeamInsight, MatchupInsight } from '../types';

export const TEAM_DATABASE: Record<string, TeamInsight> = {
  lsu: {
    teamName: 'LSU Tigers',
    school: 'Louisiana State University',
    record: '42-15',
    era: '3.12',
    battingAvg: '.298',
    slug: '.512',
    rank: 3,
    draftProspects: ['Jared Jones (SP)', 'Tommy White (1B)', 'Cade Doughty (SS)'],
    insight:
      'LSU enters the postseason as one of the hottest teams in the country. Their pitching staff has been dominant over the last 6 weeks — posting a 2.84 ERA in conference play. Tommy White projects as a top-10 pick, generating strong draft market interest. Betting lines consistently undervalue their run differential relative to market expectations.',
  },
  vanderbilt: {
    teamName: 'Vanderbilt Commodores',
    school: 'Vanderbilt University',
    record: '38-18',
    era: '3.45',
    battingAvg: '.284',
    slug: '.478',
    rank: 8,
    draftProspects: ['Enrique Bradfield Jr. (OF)', 'Patrick Reilly (SP)'],
    insight:
      "Vanderbilt's analytical edge remains elite. Bradfield Jr. projects as the fastest runner in the 2024 class — his stolen base rate of 91% is historically rare at this level. The Commodores pitching depth gives them a 3-game series advantage. Market is overweighting their early-season struggles while ignoring a +48 run differential since mid-April.",
  },
  'texas a&m': {
    teamName: 'Texas A&M Aggies',
    school: 'Texas A&M University',
    record: '40-17',
    era: '3.28',
    battingAvg: '.291',
    slug: '.497',
    rank: 5,
    draftProspects: ['Ty Madden (SP)', 'Bryce Blaum (3B)'],
    insight:
      "Texas A&M is quietly one of the most dangerous teams in the field. Their weekend rotation is elite — Ty Madden is a potential top-5 draft pick generating significant market upside. The Aggies have a 22-4 record in day games, a matchup-dependent edge most models miss. Market is pricing them as a 4-seed underdog despite a stronger SOS than Florida.",
  },
  florida: {
    teamName: 'Florida Gators',
    school: 'University of Florida',
    record: '39-19',
    era: '3.67',
    battingAvg: '.277',
    slug: '.461',
    rank: 7,
    draftProspects: ['Josh Rivera (SS)', 'BT Riopelle (C)'],
    insight:
      "Florida's offense has underperformed expectations relative to talent, but their defensive metrics are the best in the SEC. Rivera is generating consistent first-round chatter, which is pushing draft market prices up. Historically, Florida teams coached by O'Sullivan outperform their regular-season seed by 1.2 wins in neutral-site tournaments.",
  },
  'wake forest': {
    teamName: 'Wake Forest Demon Deacons',
    school: 'Wake Forest University',
    record: '36-20',
    era: '3.91',
    battingAvg: '.271',
    slug: '.444',
    rank: 14,
    draftProspects: ['Nick Kurtz (1B)', 'Andrew Morris (SP)'],
    insight:
      "Wake Forest is one of the most undervalued teams in the field. Nick Kurtz is arguably the best pure hitter in college baseball — projecting as a top-3 draft pick with a .401 BA and 18 HR. The market is sleeping on their ACC tournament performance: 5-1 with a team ERA of 1.88. Strong fade opportunity for teams that overlook them.",
  },
  tennessee: {
    teamName: 'Tennessee Volunteers',
    school: 'University of Tennessee',
    record: '44-13',
    era: '2.98',
    battingAvg: '.306',
    slug: '.534',
    rank: 1,
    draftProspects: ['Drew Beam (SP)', 'Cortland Lawson (SS)', 'Hunter Ensley (OF)'],
    insight:
      "Tennessee is the consensus #1 seed and for good reason — their offense ranks first nationally in runs scored while their pitching has been historically efficient. Drew Beam is tracking as a top-15 draft pick. The market respects their dominance, but sharp money is looking for edges in late-game scenarios where their bullpen has shown occasional cracks.",
  },
};

export const PRESET_MATCHUPS: MatchupInsight[] = [
  {
    teamA: TEAM_DATABASE['lsu'],
    teamB: TEAM_DATABASE['vanderbilt'],
    summary:
      "In a potential Super Regional showdown, LSU's powerful lineup versus Vanderbilt's analytical pitching approach creates a genuine toss-up. LSU holds a slight edge in raw power metrics (+14 HR differential), but Vanderbilt's Bradfield Jr. creates havoc on the bases that distorts traditional run expectancy models. Historical data favors Vanderbilt in neutral-site 3-game series by a narrow margin.",
    marketOdds:
      "Current Draft Market: LSU prospects generating 18% more draft contract activity this week. Vanderbilt leads in expected draft value per plate appearance.",
    winProbabilityA: 52,
    winProbabilityB: 48,
    draftValueEdge: 'LSU leads in aggregate draft market cap by est. $4.2M',
  },
];

export const generateMatchupInsight = (
  teamAKey: string,
  teamBKey: string
): MatchupInsight | null => {
  const teamA = TEAM_DATABASE[teamAKey.toLowerCase()];
  const teamB = TEAM_DATABASE[teamBKey.toLowerCase()];

  if (!teamA || !teamB) return null;

  const probA = Math.floor(45 + Math.random() * 20);
  const probB = 100 - probA;

  return {
    teamA,
    teamB,
    summary: `${teamA.teamName} vs ${teamB.teamName} presents a compelling analytical matchup. ${teamA.teamName}'s ${teamA.era} ERA versus ${teamB.teamName}'s ${teamB.battingAvg} batting average creates a classic pitcher vs. hitter dynamic. Both teams carry legitimate draft market exposure heading into postseason play.`,
    marketOdds: `${teamA.teamName} draft prospects showing ${Math.floor(10 + Math.random() * 25)}% increased market activity. ${teamB.teamName} generating strong interest at ${Math.floor(10 + Math.random() * 25)}% above baseline.`,
    winProbabilityA: probA,
    winProbabilityB: probB,
    draftValueEdge: `${probA > probB ? teamA.teamName : teamB.teamName} leads in aggregate draft value by est. $${(1.5 + Math.random() * 5).toFixed(1)}M`,
  };
};

export const findTeam = (query: string): TeamInsight | null => {
  const q = query.toLowerCase().trim();
  for (const [key, team] of Object.entries(TEAM_DATABASE)) {
    if (
      key.includes(q) ||
      team.teamName.toLowerCase().includes(q) ||
      team.school?.toLowerCase().includes(q)
    ) {
      return team;
    }
  }
  return null;
};

export const SEARCH_SUGGESTIONS = [
  'LSU',
  'Vanderbilt',
  'Tennessee',
  'Texas A&M',
  'Florida',
  'Wake Forest',
];
