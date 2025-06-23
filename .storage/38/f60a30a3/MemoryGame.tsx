import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CardType, CardState } from "@/types/game";
import { motion } from "framer-motion";

interface MemoryGameProps {
  cards: CardType[];
  flippedCards: number[];
  matchedPairs: number[];
  score: number;
  bestScore: number;
  turns: number;
  timeElapsed: number;
  gameOver: boolean;
  isGameStarted: boolean;
  handleCardClick: (index: number) => void;
  handleRestartGame: () => void;
  handleStartGame: () => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({
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
}) => {
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getCardState = (index: number): CardState => {
    if (matchedPairs.includes(index)) return "matched";
    if (flippedCards.includes(index)) return "flipped";
    return "hidden";
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 max-w-4xl mx-auto p-4 md:p-6 select-none">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
        <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center">
          <Badge variant="outline" className="text-lg bg-primary/10 p-2">
            Score: {score}
          </Badge>
          <Badge variant="outline" className="text-lg bg-primary/5 p-2">
            Best: {bestScore}
          </Badge>
          <Badge variant="outline" className="text-lg p-2">
            Turns: {turns}
          </Badge>
          <Badge variant="outline" className="text-lg p-2">
            Time: {formatTime(timeElapsed)}
          </Badge>
        </div>

        <Button 
          variant={isGameStarted ? "outline" : "default"} 
          className="px-6" 
          onClick={isGameStarted ? handleRestartGame : handleStartGame}
        >
          {isGameStarted ? "Restart" : "Start Game"}
        </Button>
      </div>

      {gameOver && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary text-primary-foreground p-6 rounded-lg shadow-lg text-center mb-4"
        >
          <h2 className="text-2xl font-bold mb-2">Game Complete!</h2>
          <p className="mb-3">You finished in {formatTime(timeElapsed)} with {turns} turns</p>
          {score > bestScore && score > 0 && (
            <p className="font-bold text-md">New High Score: {score}!</p>
          )}
          <Button onClick={handleRestartGame} className="mt-3 bg-background text-foreground hover:bg-background/80">
            Play Again
          </Button>
        </motion.div>
      )}

      {!isGameStarted && !gameOver && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-card text-card-foreground p-6 rounded-lg shadow-lg text-center mb-6 max-w-md"
        >
          <h2 className="text-2xl font-bold mb-3">Memory Match</h2>
          <p className="mb-4">Find all the matching pairs in as few turns as possible. Click cards to flip them and make matches!</p>
          <Button onClick={handleStartGame} size="lg" className="bg-primary hover:bg-primary/90">
            Start Game
          </Button>
        </motion.div>
      )}

      {isGameStarted && (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {cards.map((card, index) => (
            <div key={index} className="aspect-square">
              <motion.div
                className="w-full h-full"
                initial={false}
                animate={{
                  rotateY: flippedCards.includes(index) || matchedPairs.includes(index) ? 180 : 0,
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                onClick={() => handleCardClick(index)}
              >
                <Card 
                  className={cn(
                    "w-full h-full rounded-lg cursor-pointer transition-all flex items-center justify-center text-4xl shadow-md",
                    getCardState(index) === "hidden" ? "bg-primary hover:bg-primary/90" : "",
                    getCardState(index) === "flipped" ? "bg-secondary" : "",
                    getCardState(index) === "matched" ? "bg-green-500/20" : "",
                    "transform preserve-3d"
                  )}
                >
                  <div className="card-front absolute w-full h-full backface-hidden flex items-center justify-center">
                    <span className="text-2xl">❓</span>
                  </div>
                  <div className="card-back absolute w-full h-full backface-hidden flex items-center justify-center rotateY-180">
                    <span className="text-4xl">{card.emoji}</span>
                  </div>
                </Card>
              </motion.div>
            </div>
          ))}
        </motion.div>
      )}

      <style jsx global>{`
        .preserve-3d {
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotateY-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default MemoryGame;
