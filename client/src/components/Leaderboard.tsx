// import React from "react";
// import { useLeaderboard } from "@/hooks/useLeaderboard";
// import type { LeaderboardProps } from "@/types/ai2";
//
// const getRankIcon = (rank: number) => {
//   switch (rank) {
//     case 1:
//       return "🥇";
//     case 2:
//       return "🥈";
//     case 3:
//       return "🥉";
//     default:
//       return `#${rank}`;
//   }
// };
//
// const getRankStyles = (rank: number) => {
//   switch (rank) {
//     case 1:
//       return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900";
//     case 2:
//       return "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900";
//     case 3:
//       return "bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100";
//     default:
//       return "bg-gradient-to-r from-blue-500 to-purple-600 text-white";
//   }
// };
//
// export default function Leaderboard({ tableName = "ai2_leaderboard", limit = 10 }: LeaderboardProps) {
//   const { participants, loading, error } = useLeaderboard({ tableName, limit });
//
//   if (loading) {
//     return (
//       <div className="leaderboard-container">
//         <h2 className="leaderboard-title">Leaderboard</h2>
//         <div className="leaderboard-loading">
//           <div className="loading-spinner"></div>
//           <p>Loading leaderboard...</p>
//         </div>
//       </div>
//     );
//   }
//
//   if (error) {
//     return (
//       <div className="leaderboard-container">
//         <h2 className="leaderboard-title">Leaderboard</h2>
//         <div className="leaderboard-error">
//           <p>Failed to load leaderboard</p>
//           <p className="error-details">{error}</p>
//         </div>
//       </div>
//     );
//   }
//
//   return (
//     <div className="leaderboard-container">
//       <h2 className="leaderboard-title">Leaderboard</h2>
//       <div className="leaderboard-grid">
//         {participants.length === 0 ? (
//           <div className="no-participants">
//             <p>No participants yet!</p>
//           </div>
//         ) : (
//           participants.map((participant, index) => {
//             const rank = index + 1;
//             return (
//               <div key={participant.id} className="leaderboard-row">
//                 <div className={`rank-badge ${getRankStyles(rank)}`}>
//                   {getRankIcon(rank)}
//                 </div>
//                 <div className="participant-info">
//                   <div className="participant-name">{participant.username}</div>
//                   <div className="participant-elo">
//                     {(() => {
//                       const eloNum = Number(participant.elo);
//                       return Number.isFinite(eloNum) ? `${Math.round(eloNum)} ELO` : '—';
//                     })()}
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }
