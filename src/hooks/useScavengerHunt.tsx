import { useState, useEffect } from 'react';

export interface HuntClue {
  id: string;
  found: boolean;
  location: string;
  hint: string;
  secretCode: string;
  reward?: string;
}

export interface HuntProgress {
  cluesFound: string[];
  currentStage: number;
  completed: boolean;
  finalReward?: string;
}

const HUNT_CLUES: HuntClue[] = [
  {
    id: 'terminal-secret',
    found: false,
    location: 'terminal',
    hint: 'Look for hidden commands in the terminal section',
    secretCode: 'konami',
    reward: 'Found the first clue! 🎮'
  },
  {
    id: 'hidden-element',
    found: false,
    location: 'simple',
    hint: 'Something is hiding in the hero section...',
    secretCode: 'matrix',
    reward: 'The Matrix has you... 🔴'
  },
  {
    id: 'css-secret',
    found: false,
    location: 'projects',
    hint: 'Click the secret area in the projects section',
    secretCode: 'easteregg',
    reward: 'You found the Easter egg! 🥚'
  },
  {
    id: 'file-explorer',
    found: false,
    location: 'terminal',
    hint: 'Explore the file structure for hidden files',
    secretCode: 'hidden',
    reward: 'Hidden files revealed! 📁'
  },
  {
    id: 'final-challenge',
    found: false,
    location: 'terminal',
    hint: 'Use all previous codes in a special command',
    secretCode: 'unlock-vault',
    reward: 'Welcome to the secret vault! 🔓'
  }
];

export const useScavengerHunt = () => {
  const [progress, setProgress] = useState<HuntProgress>(() => {
    const saved = localStorage.getItem('scavenger-hunt-progress');
    return saved ? JSON.parse(saved) : {
      cluesFound: [],
      currentStage: 0,
      completed: false
    };
  });

  const [clues, setClues] = useState<HuntClue[]>(() => {
    const saved = localStorage.getItem('scavenger-hunt-clues');
    return saved ? JSON.parse(saved) : HUNT_CLUES;
  });

  useEffect(() => {
    localStorage.setItem('scavenger-hunt-progress', JSON.stringify(progress));
    localStorage.setItem('scavenger-hunt-clues', JSON.stringify(clues));
  }, [progress, clues]);

  const findClue = (clueId: string, location?: string) => {
    const clue = clues.find(c => c.id === clueId);
    if (!clue || clue.found) return null;

    const updatedClues = clues.map(c => 
      c.id === clueId ? { ...c, found: true } : c
    );
    setClues(updatedClues);

    const newProgress = {
      ...progress,
      cluesFound: [...progress.cluesFound, clueId],
      currentStage: Math.min(progress.currentStage + 1, HUNT_CLUES.length)
    };

    if (newProgress.cluesFound.length === HUNT_CLUES.length) {
      newProgress.completed = true;
      newProgress.finalReward = '🎉 Congratulations! You\'ve unlocked my secret developer vault! 🏆';
    }

    setProgress(newProgress);
    return clue;
  };

  const getNextClue = () => {
    return clues.find(c => !c.found);
  };

  const resetHunt = () => {
    setProgress({
      cluesFound: [],
      currentStage: 0,
      completed: false
    });
    setClues(HUNT_CLUES.map(c => ({ ...c, found: false })));
    localStorage.removeItem('scavenger-hunt-progress');
    localStorage.removeItem('scavenger-hunt-clues');
  };

  const checkSecretCode = (code: string) => {
    const clue = clues.find(c => c.secretCode === code && !c.found);
    if (clue) {
      return findClue(clue.id);
    }
    return null;
  };

  return {
    progress,
    clues,
    findClue,
    getNextClue,
    resetHunt,
    checkSecretCode,
    isActive: !progress.completed
  };
};