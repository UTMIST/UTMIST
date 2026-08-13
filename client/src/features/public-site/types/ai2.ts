export interface LeaderboardParticipant {
  id: string;
  username: string;
  elo: number;
  created_at?: string;
  updated_at?: string;
}

export interface LeaderboardProps {
  tableName?: string;
  limit?: number;
}
