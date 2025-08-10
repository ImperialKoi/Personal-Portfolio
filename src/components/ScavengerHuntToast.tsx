import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Trophy, Search, Gift } from 'lucide-react';

interface ScavengerHuntToastProps {
  clue?: {
    id: string;
    found: boolean;
    location: string;
    hint: string;
    secretCode: string;
    reward?: string;
  };
  progress: {
    cluesFound: string[];
    currentStage: number;
    completed: boolean;
    finalReward?: string;
  };
  showNextHint?: boolean;
}

export const ScavengerHuntToast = ({ clue, progress, showNextHint }: ScavengerHuntToastProps) => {
  useEffect(() => {
    if (clue && clue.found) {
      toast({
        title: "🔍 Clue Found!",
        description: clue.reward || "Great job finding this clue!",
        duration: 4000,
      });
    }
  }, [clue]);

  useEffect(() => {
    if (progress.completed && progress.finalReward) {
      toast({
        title: "🎉 Hunt Complete!",
        description: progress.finalReward,
        duration: 6000,
      });
    }
  }, [progress.completed, progress.finalReward]);

  useEffect(() => {
    if (showNextHint && !progress.completed) {
      const nextClue = getNextAvailableClue();
      if (nextClue) {
        toast({
          title: "🧭 Next Clue",
          description: nextClue.hint,
          duration: 5000,
        });
      }
    }
  }, [showNextHint, progress.currentStage]);

  const getNextAvailableClue = () => {
    // This would need to be passed from the parent component or context
    return null;
  };

  return null;
};