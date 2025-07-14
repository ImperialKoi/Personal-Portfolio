import { useState, useEffect, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface GameState {
  snake: Position[];
  food: Position;
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  gameOver: boolean;
  score: number;
  isPlaying: boolean;
  highScore: number;
}

const BOARD_WIDTH = 38;
const BOARD_HEIGHT = 10;
const INITIAL_SNAKE = [{ x: 10, y: 5 }];
const INITIAL_FOOD = { x: 15, y: 5 };

export const useSnakeGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: INITIAL_FOOD,
    direction: 'RIGHT',
    gameOver: false,
    score: 0,
    isPlaying: false,
    highScore: 0,
  });

  const generateFood = useCallback((snake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_WIDTH),
        y: Math.floor(Math.random() * BOARD_HEIGHT),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (!prev.isPlaying || prev.gameOver) return prev;

      const head = prev.snake[0];
      let newHead: Position;

      switch (prev.direction) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= BOARD_WIDTH || newHead.y < 0 || newHead.y >= BOARD_HEIGHT) {
        const newHighScore = Math.max(prev.score, prev.highScore);
        return { ...prev, gameOver: true, isPlaying: false, highScore: newHighScore };
      }

      // Check self collision
      if (prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        const newHighScore = Math.max(prev.score, prev.highScore);
        return { ...prev, gameOver: true, isPlaying: false, highScore: newHighScore };
      }

      const newSnake = [newHead, ...prev.snake];

      // Check food collision
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        const newFood = generateFood(newSnake);
        return {
          ...prev,
          snake: newSnake,
          food: newFood,
          score: prev.score + 10,
        };
      } else {
        newSnake.pop(); // Remove tail if no food eaten
        return {
          ...prev,
          snake: newSnake,
        };
      }
    });
  }, [generateFood]);

  const handleKeyPress = useCallback((key: string) => {
    setGameState(prev => {
      if (prev.gameOver) return prev;

      let newDirection = prev.direction;
      
      switch (key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          if (prev.direction !== 'DOWN') newDirection = 'UP';
          break;
        case 's':
        case 'arrowdown':
          if (prev.direction !== 'UP') newDirection = 'DOWN';
          break;
        case 'a':
        case 'arrowleft':
          if (prev.direction !== 'RIGHT') newDirection = 'LEFT';
          break;
        case 'd':
        case 'arrowright':
          if (prev.direction !== 'LEFT') newDirection = 'RIGHT';
          break;
        case ' ':
          return { ...prev, isPlaying: !prev.isPlaying };
        case 'escape':
          return { ...prev, gameOver: true, isPlaying: false };
      }

      return { ...prev, direction: newDirection };
    });
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      snake: INITIAL_SNAKE,
      food: INITIAL_FOOD,
      direction: 'RIGHT',
      gameOver: false,
      score: 0,
      isPlaying: true,
      highScore: prev.highScore,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      snake: INITIAL_SNAKE,
      food: INITIAL_FOOD,
      direction: 'RIGHT',
      gameOver: false,
      score: 0,
      isPlaying: false,
      highScore: prev.highScore,
    }));
  }, []);

  const renderGame = useCallback(() => {
    const board: string[][] = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(' '));

    // Place food
    board[gameState.food.y][gameState.food.x] = '◉';

    // Place snake
    gameState.snake.forEach((segment, index) => {
      if (index === 0) {
        board[segment.y][segment.x] = '●'; // Head
      } else {
        board[segment.y][segment.x] = '○'; // Body
      }
    });

    const lines = [
      '🐍 SNAKE GAME',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '┌────────────────────────────────────────┐',
      ...board.map(row => `│${row.join('')}│`),
      '└────────────────────────────────────────┘',
      '',
      `Score: ${gameState.score} | High Score: ${gameState.highScore}`,
      gameState.isPlaying ? 'Use WASD or arrow keys to move' : 'Press SPACE to start/pause',
      'Press ESC to quit',
      '',
    ];

    if (gameState.gameOver) {
      lines.push(`💀 Game Over! Final Score: ${gameState.score}`);
      if (gameState.score === gameState.highScore && gameState.score > 0) {
        lines.push('🏆 NEW HIGH SCORE! 🏆');
      }
      lines.push('Press "snake" to play again.');
    }

    return lines;
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying || gameState.gameOver) return;

    const interval = setInterval(moveSnake, 150); // Faster game loop - 150ms instead of 200ms
    return () => clearInterval(interval);
  }, [gameState.isPlaying, gameState.gameOver, moveSnake]);

  return {
    gameState,
    handleKeyPress,
    startGame,
    resetGame,
    renderGame,
  };
};