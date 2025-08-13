import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
  name?: string;
}

const NAME_DEFAULT = 'DANIEL XU';

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const letterVariants = {
  hidden: { y: -80, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.5 },
  },
};

export default function LoadingScreen({ onComplete, name = NAME_DEFAULT }: LoadingScreenProps) {
  const letters = useMemo(() => name.split(''), [name]);
  const [phase, setPhase] = useState<'intro' | 'split' | 'done'>('intro');

  useEffect(() => {
    const introMs = 1500; // letter entrance
    const bounceMs = 450; // subtle bounce
    const splitMs = 900;  // panel split reveal

    const t1 = setTimeout(() => setPhase('split'), introMs + bounceMs);
    const t2 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, introMs + bounceMs + splitMs + 100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[hsl(0_0%_0%)] overflow-hidden">
      {/* Centered intro text */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative"
              initial={{ y: 0 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.5, delay: 1.2, ease: 'easeOut' }}
            >
              <motion.div
                className="flex gap-[0.15em] select-none"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {letters.map((ch, i) => (
                  <motion.span
                    key={i}
                    variants={letterVariants}
                    className="text-[clamp(2rem,8vw,6rem)] leading-none font-extrabold tracking-[0.1em] text-[hsl(0_0%_100%)]"
                  >
                    {ch === ' ' ? '\u00A0' : ch}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Split reveal stage */}
      {phase === 'split' && (
        <>
          {/* Panels */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full bg-[hsl(0_0%_0%)]"
            initial={{ y: 0 }}
            animate={{ y: '-100%' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full bg-[hsl(0_0%_0%)]"
            initial={{ y: 0 }}
            animate={{ y: '100%' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Text halves following their sides (left up, right down) */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ y: 0 }}
            animate={{ y: '-100%' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ clipPath: 'inset(0 50% 0 0)' }} className="pr-1">
              <div className="text-[clamp(2rem,8vw,6rem)] leading-none font-extrabold tracking-[0.1em] text-[hsl(0_0%_100%)]">
                {name}
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ y: 0 }}
            animate={{ y: '100%' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ clipPath: 'inset(0 0 0 50%)' }} className="pl-1">
              <div className="text-[clamp(2rem,8vw,6rem)] leading-none font-extrabold tracking-[0.1em] text-[hsl(0_0%_100%)]">
                {name}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
