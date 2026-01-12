export enum AppScreen {
  GAME = 'GAME',
  LEADERBOARD = 'LEADERBOARD',
  PROFILE = 'PROFILE',
  PREMIUM = 'PREMIUM'
}

export interface DuelOption {
  id: string;
  text: string;
  percentage: number; 
}

export interface Duel {
  id: string;
  category: string;
  question: string;
  options: [DuelOption, DuelOption];
  totalVotes: number;
  isRare?: boolean; // New: 1% chance of rare questions
}

export interface Mission {
  id: string;
  description: string;
  target: number;
  current: number;
  rewardXP: number;
  completed: boolean;
  expiresAt: number; // For 3h resets
}

export interface UserState {
  energy: number;
  maxEnergy: number;
  score: number;
  xp: number; // New: Experience points
  level: number; // New: Current level
  title: string; // New: "Leitor da Mente", etc.
  streak: number;
  history: Array<{
    duelId: string;
    won: boolean;
    timestamp: number;
  }>;
  isPremium: boolean;
  badges: string[];
  missions: Mission[]; // New: Active missions
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  streak: number;
  avatar: string;
  isBot: boolean;
  rank: number; // Global rank position
}
