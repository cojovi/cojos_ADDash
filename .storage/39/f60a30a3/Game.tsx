import React from 'react';
import { Helmet } from 'react-helmet';
import MemoryGame from '@/components/MemoryGame';
import { useMemoryGame } from '@/hooks/useMemoryGame';

const Game = () => {
  const {
    cards,
    flippedCards,
    matchedPairs,
    score,
    bestScore,
    turns,
    timeElapsed,
    gameOver,
    isGameStarted,
    handleCardClick,
    handleRestartGame,
    handleStartGame,
  } = useMemoryGame();

  return (
    <>
      <Helmet>
        <title>Memory Match Game | Find The Pairs</title>
      </Helmet>
      
      <div className="container mx-auto py-8 min-h-screen">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            Memory Match
          </h1>
          <p className="text-muted-foreground text-lg">Find all matching pairs of cards</p>
        </div>
        
        <MemoryGame
          cards={cards}
          flippedCards={flippedCards}
          matchedPairs={matchedPairs}
          score={score}
          bestScore={bestScore}
          turns={turns}
          timeElapsed={timeElapsed}
          gameOver={gameOver}
          isGameStarted={isGameStarted}
          handleCardClick={handleCardClick}
          handleRestartGame={handleRestartGame}
          handleStartGame={handleStartGame}
        />

        <div className="mt-10 max-w-md mx-auto text-center text-sm text-muted-foreground">
          <p>Test your memory by finding all the matching pairs with as few turns as possible.</p>
          <p className="mt-2">Each match earns points, but the faster you finish, the higher your score!</p>
        </div>
      </div>
    </>
  );
};

export default Game;
