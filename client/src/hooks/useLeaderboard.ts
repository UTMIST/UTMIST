import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import type { LeaderboardParticipant } from "@/types/ai2";

interface UseLeaderboardProps {
  tableName?: string;
  limit?: number;
}

export const useLeaderboard = ({ tableName = "ai2_leaderboard", limit = 10 }: UseLeaderboardProps = {}) => {
  const [participants, setParticipants] = useState<LeaderboardParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const query = supabase
          .from(tableName)
          .select("*")
          .order("elo", { ascending: false })
          .limit(limit);

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        setParticipants(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch leaderboard");
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`leaderboard_${tableName}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: tableName,
        },
        () => {
          fetchLeaderboard(); // Refetch data when changes occur
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [tableName, limit]);

  return { participants, loading, error };
};
