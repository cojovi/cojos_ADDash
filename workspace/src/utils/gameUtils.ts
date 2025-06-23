import { CardType, GameDifficulty, DIFFICULTY_SETTINGS } from "@/types/game";

// Array of emoji characters to use for card faces
const CARD_EMOJIS = [
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
  "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔",
  "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺",
  "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞",
  "🐜", "🦟", "🦗", "🕷", "🦂", "🐢", "🐍", "🦎",
  "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡",
];

/**
 * Creates a shuffled deck of cards with pairs of matching emojis
 * 
 * @param difficulty The game difficulty setting that determines the number of pairs
 * @returns An array of card objects
 */
export const createCards = (difficulty: GameDifficulty = GameDifficulty.Medium): CardType[] => {
  // Get the number of pairs needed for this difficulty
  const { pairCount } = DIFFICULTY_SETTINGS[difficulty];
  
  // Select the needed emojis
  const selectedEmojis = [...CARD_EMOJIS].slice(0, pairCount);
  
  // Create pairs of cards with the same emoji
  const cardPairs = selectedEmojis.flatMap((emoji, index) => [
    { id: index, emoji, isMatched: false },
    { id: index, emoji, isMatched: false },
  ]);
  
  // Shuffle the cards
  return shuffleArray(cardPairs);
};

/**
 * Shuffle an array using the Fisher-Yates algorithm
 * 
 * @param array The array to be shuffled
 * @returns A new shuffled array
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  
  return newArray;
};

/**
 * Calculate score based on matches, turns, and time
 * 
 * @param matchCount Number of successful matches
 * @param turns Number of turns taken
 * @param timeElapsed Time elapsed in seconds
 * @param difficulty Game difficulty level
 * @returns The calculated score
 */
export const calculateScore = (
  matchCount: number,
  turns: number,
  timeElapsed: number,
  difficulty: GameDifficulty
): number => {
  const { baseScore, pairCount, timeBonus } = DIFFICULTY_SETTINGS[difficulty];
  const maxTime = 300; // 5 minutes max time

  // Base points for each match
  const matchPoints = (matchCount / pairCount) * baseScore;
  
  // Penalty for excessive turns (optimal is 2 * pairCount)
  const turnEfficiency = Math.max(0, 1 - (turns - pairCount * 2) / (pairCount * 3));
  
  // Time bonus (faster completion gets more points)
  const timeEfficiency = Math.max(0, 1 - timeElapsed / maxTime);
  
  // Calculate final score
  const score = Math.round(
    matchPoints * (0.7 + 0.3 * turnEfficiency) + timeEfficiency * timeBonus * pairCount
  );
  
  return Math.max(0, score); // Ensure score is not negative
};

/**
 * Checks if the game is over (all pairs are matched)
 * 
 * @param matchedPairs Array of indices of matched cards
 * @param totalPairs Total number of pairs in the game
 * @returns Boolean indicating if the game is complete
 */
export const isGameComplete = (matchedPairs: number[], totalPairs: number): boolean => {
  // Each matched pair contains two cards
  const uniquePairs = new Set(matchedPairs).size;
  return uniquePairs === totalPairs;
};

/**
 * Gets a suitable message based on game performance
 * 
 * @param score Player's score
 * @param bestScore Best score achieved
 * @param turns Number of turns taken
 * @returns A message string appropriate for the performance
 */
export const getPerformanceMessage = (
  score: number,
  bestScore: number,
  turns: number,
  difficulty: GameDifficulty
): string => {
  const { pairCount } = DIFFICULTY_SETTINGS[difficulty];
  const optimalTurns = pairCount * 2;
  
  if (score > bestScore && bestScore > 0) {
    return "Amazing! You beat your best score!";
  }
  
  if (turns <= optimalTurns) {
    return "Perfect memory! You couldn't have done better!";
  }
  
  if (turns <= optimalTurns * 1.5) {
    return "Great job! Your memory is impressive!";
  }
  
  if (turns <= optimalTurns * 2) {
    return "Good work! Keep practicing to improve!";
  }
  
  return "Nice try! Keep going to sharpen your memory!";
};