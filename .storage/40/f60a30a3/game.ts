// Card state types
export type CardState = "hidden" | "flipped" | "matched";

// Card object type
export interface CardType {
  id: number;
  emoji: string;
  isMatched: boolean;
}

// Game difficulty levels
export enum GameDifficulty {
  Easy = "easy", // 4x3 grid (12 cards, 6 pairs)
  Medium = "medium", // 4x4 grid (16 cards, 8 pairs)
  Hard = "hard", // 6x4 grid (24 cards, 12 pairs)
}

// Game state interface
export interface GameState {
  cards: CardType[];
  flippedCards: number[];
  matchedPairs: number[];
  score: number;
  bestScore: number;
  turns: number;
  timeElapsed: number;
  startTime: number | null;
  gameOver: boolean;
  isGameStarted: boolean;
  difficulty: GameDifficulty;
}

// Score data stored in local storage
export interface StoredScoreData {
  bestScore: number;
  fastestTime?: number; // in seconds
  lowestTurns?: number;
  lastPlayed: string; // ISO date string
}

// The result of a turn (matching attempt)
export interface TurnResult {
  isMatch: boolean;
  matchedCardId?: number;
  firstCardIndex: number;
  secondCardIndex: number;
}

// Config for different difficulty levels
export interface DifficultyConfig {
  rows: number;
  columns: number;
  pairCount: number;
  baseScore: number;
  timeBonus: number;
}

export const DIFFICULTY_SETTINGS: Record<GameDifficulty, DifficultyConfig> = {
  [GameDifficulty.Easy]: {
    rows: 3,
    columns: 4,
    pairCount: 6,
    baseScore: 100,
    timeBonus: 10, // points per second remaining
  },
  [GameDifficulty.Medium]: {
    rows: 4,
    columns: 4,
    pairCount: 8,
    baseScore: 150,
    timeBonus: 15,
  },
  [GameDifficulty.Hard]: {
    rows: 4,
    columns: 6,
    pairCount: 12,
    baseScore: 200,
    timeBonus: 20,
  },
};

// Time limits in seconds for each difficulty
export const TIME_LIMITS: Record<GameDifficulty, number> = {
  [GameDifficulty.Easy]: 60,
  [GameDifficulty.Medium]: 120,
  [GameDifficulty.Hard]: 180,
};

// Local storage key for saving game data
export const LOCAL_STORAGE_KEY = "memory-match-game-scores";
