import { LeaderboardEntry } from "../types";

const FIRST_NAMES = ["Lucas", "Ana", "Beatriz", "João", "Gabriel", "Mariana", "Pedro", "Julia", "Matheus", "Larissa", "Rafael", "Camila", "Gustavo", "Fernanda", "Felipe", "Amanda", "Bruno", "Carolina", "Daniel", "Leticia"];
const LAST_NAMES = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", "Soares", "Fernandes", "Vieira", "Barbosa"];

const TITLES = [
  "Iniciante", "Observador", "Palpiteiro", "Vidente", "Leitor de Mentes", 
  "Oráculo", "Mestre da Maioria", "Lenda Viva", "Deus do Voto"
];

// Deterministic random for avatars based on name
const getAvatar = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

export const generateBotName = (): string => {
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${first} ${last}`;
};

export const getTitleForLevel = (level: number): string => {
  const index = Math.min(Math.floor(level / 5), TITLES.length - 1);
  return TITLES[index];
};

// Generates a "slice" of the leaderboard around a specific rank
// This simulates 100,000+ users without holding them in memory
export const generateLeaderboardSlice = (centerRank: number, userEntry: LeaderboardEntry): LeaderboardEntry[] => {
  const entries: LeaderboardEntry[] = [];
  const startRank = Math.max(1, centerRank - 4);
  const endRank = centerRank + 5;

  for (let r = startRank; r <= endRank; r++) {
    if (r === centerRank) {
      entries.push({ ...userEntry, rank: r });
    } else {
      // Simulate score based on rank (lower rank = higher score)
      // Top 1 has ~1M points, Rank 100k has ~100 points
      const simulatedScore = Math.floor(1000000 / (r * 0.5 + 1)) + Math.floor(Math.random() * 500);
      const name = generateBotName();
      entries.push({
        id: `bot-${r}`,
        name: name,
        score: simulatedScore,
        streak: Math.floor(Math.random() * 15),
        avatar: getAvatar(name),
        isBot: true,
        rank: r
      });
    }
  }
  return entries.sort((a, b) => a.rank - b.rank);
};
