import { useState, useEffect, useCallback } from 'react';
import { 
  CardType, 
  GameState, 
  GameDifficulty, 
  LOCAL_STORAGE_KEY, 
  StoredScoreData,
  DIFFICULTY_SETTINGS,
} from '@/types/game';
import { 
  createCards, 
  calculateScore, 
  isGameComplete,
} from '@/utils/gameUtils';

export const useMemoryGame = (initialDifficulty: GameDifficulty = GameDifficulty.Medium) => {
  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    flippedCards: [],
    matchedPairs: [],
    score: 0,
    bestScore: 0,
    turns: 0,
    timeElapsed: 0,
    startTime: null,
    gameOver: false,
    isGameStarted: false,
    difficulty: initialDifficulty,
  });

  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  // Load best score from localStorage
  useEffect(() => {
    const loadBestScore = () => {
      try {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData) as Record<GameDifficulty, StoredScoreData>;
          const difficultyData = parsedData[gameState.difficulty];
          
          if (difficultyData) {
            setGameState(prev => ({
              ...prev,
              bestScore: difficultyData.bestScore || 0,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load saved scores:", error);
      }
    };

    loadBestScore();
  }, [gameState.difficulty]);

  // Initialize the game
  const initializeGame = useCallback(() => {
    const newCards = createCards(gameState.difficulty);
    
    setGameState(prev => ({
      ...prev,
      cards: newCards,
      flippedCards: [],
      matchedPairs: [],
      score: 0,
      turns: 0,
      timeElapsed: 0,
      startTime: null,
      gameOver: false,
      isGameStarted: false,
    }));
    
    // Clear any existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [gameState.difficulty, timerInterval]);

  // Initialize game on mount and difficulty change
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Timer logic
  useEffect(() => {
    if (gameState.isGameStarted && !gameState.gameOver && gameState.startTime) {
      const timer = window.setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeElapsed: Math.floor((Date.now() - prev.startTime!) / 1000),
        }));
      }, 1000);
      
      setTimerInterval(timer);
      
      return () => {
        clearInterval(timer);
      };
    }
  }, [gameState.isGameStarted, gameState.gameOver, gameState.startTime]);

  // Handle card click
  const handleCardClick = (index: number) => {
    // Prevent actions if game is not started or is over
    if (!gameState.isGameStarted || gameState.gameOver) {
      return;
    }

    // Prevent clicking on already matched pairs or the same card twice
    if (
      gameState.matchedPairs.includes(index) ||
      gameState.flippedCards.includes(index) ||
      gameState.flippedCards.length >= 2
    ) {
      return;
    }

    // Flip the card
    const newFlippedCards = [...gameState.flippedCards, index];
    
    setGameState(prev => ({
      ...prev,
      flippedCards: newFlippedCards,
    }));

    // If we have 2 flipped cards, check for a match
    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;
      const firstCard = gameState.cards[firstIndex];
      const secondCard = gameState.cards[secondIndex];
      
      // Increment turns counter
      setGameState(prev => ({
        ...prev,
        turns: prev.turns + 1,
      }));

      // Check if cards match
      if (firstCard.id === secondCard.id) {
        // Match found
        setTimeout(() => {
          const newMatchedPairs = [...gameState.matchedPairs, firstIndex, secondIndex];
          
          // Update cards to show they're matched
          const updatedCards = gameState.cards.map((card, idx) => {
            if (idx === firstIndex || idx === secondIndex) {
              return { ...card, isMatched: true };
            }
            return card;
          });
          
          // Check if game is complete
          const { pairCount } = DIFFICULTY_SETTINGS[gameState.difficulty];
          const gameComplete = isGameComplete(newMatchedPairs, pairCount);
          
          // Calculate score if game is complete
          let newScore = gameState.score;
          if (gameComplete) {
            newScore = calculateScore(
              pairCount,
              gameState.turns + 1, // Include this turn
              gameState.timeElapsed,
              gameState.difficulty
            );
            
            // Save high score to local storage if it's better than previous
            if (newScore > gameState.bestScore) {
              try {
                const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
                const scoreData: Record<GameDifficulty, StoredScoreData> = savedData 
                  ? JSON.parse(savedData) 
                  : {};
                
                scoreData[gameState.difficulty] = {
                  bestScore: newScore,
                  fastestTime: gameState.timeElapsed,
                  lowestTurns: gameState.turns + 1,
                  lastPlayed: new Date().toISOString(),
                };
                
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(scoreData));
              } catch (error) {
                console.error("Failed to save high score:", error);
              }
            }
            
            // Stop the timer
            if (timerInterval) {
              clearInterval(timerInterval);
              setTimerInterval(null);
            }
          }
          
          setGameState(prev => ({
            ...prev,
            cards: updatedCards,
            matchedPairs: newMatchedPairs,
            flippedCards: [],
            gameOver: gameComplete,
            score: newScore,
            bestScore: gameComplete && newScore > prev.bestScore ? newScore : prev.bestScore,
          }));
        }, 800); // Delay to allow the player to see both cards
      } else {
        // No match
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            flippedCards: [],
          }));
        }, 1000); // Slightly longer delay for non-matches
      }
    }
  };

  // Start a new game
  const handleStartGame = () => {
    initializeGame();
    
    // Small delay to allow animation of cards
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        isGameStarted: true,
        startTime: Date.now(),
      }));
    }, 100);
  };

  // Restart the current game
  const handleRestartGame = () => {
    initializeGame();
  };

  // Change difficulty level
  const changeDifficulty = (difficulty: GameDifficulty) => {
    setGameState(prev => ({
      ...prev,
      difficulty,
    }));
    
    initializeGame();
  };

  return {
    ...gameState,
    handleCardClick,
    handleStartGame,
    handleRestartGame,
    changeDifficulty,
  };
};
