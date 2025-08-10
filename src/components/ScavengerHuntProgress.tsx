import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Search, Trophy, MapPin, Eye, EyeOff, RotateCcw } from 'lucide-react';

interface ScavengerHuntProgressProps {
  progress: {
    cluesFound: string[];
    currentStage: number;
    completed: boolean;
    finalReward?: string;
  };
  clues: Array<{
    id: string;
    found: boolean;
    location: string;
    hint: string;
    secretCode: string;
    reward?: string;
  }>;
  onReset: () => void;
  nextClue?: {
    id: string;
    found: boolean;
    location: string;
    hint: string;
    secretCode: string;
    reward?: string;
  };
}

export const ScavengerHuntProgress = ({ 
  progress, 
  clues, 
  onReset, 
  nextClue 
}: ScavengerHuntProgressProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCodes, setShowCodes] = useState(false);

  const completionPercentage = (progress.cluesFound.length / clues.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50 max-w-sm"
    >
      <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" />
              Scavenger Hunt
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Progress</span>
              <Badge variant={progress.completed ? "default" : "secondary"}>
                {progress.cluesFound.length}/{clues.length}
              </Badge>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>

          {/* Completion Status */}
          {progress.completed ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center space-y-2"
            >
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto" />
              <p className="text-sm font-medium text-green-600">Hunt Complete!</p>
              <p className="text-xs text-muted-foreground">{progress.finalReward}</p>
            </motion.div>
          ) : nextClue ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="w-3 h-3 text-primary" />
                <span className="font-medium">Next Clue:</span>
              </div>
              <p className="text-xs text-muted-foreground">{nextClue.hint}</p>
              <Badge variant="outline" className="text-xs">
                Location: {nextClue.location}
              </Badge>
            </motion.div>
          ) : null}

          {/* Expanded Details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3 border-t pt-3"
              >
                {/* Found Clues */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Found Clues:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCodes(!showCodes)}
                      className="h-5 text-xs"
                    >
                      {showCodes ? 'Hide' : 'Show'} Codes
                    </Button>
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {clues.filter(clue => clue.found).map((clue, index) => (
                      <motion.div
                        key={clue.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between text-xs p-2 bg-green-50 dark:bg-green-900/20 rounded"
                      >
                        <span className="text-green-700 dark:text-green-400">
                          ✓ {clue.location}
                        </span>
                        {showCodes && (
                          <code className="text-xs bg-muted px-1 rounded">
                            {clue.secretCode}
                          </code>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Reset Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReset}
                  className="w-full h-7 text-xs"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset Hunt
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};