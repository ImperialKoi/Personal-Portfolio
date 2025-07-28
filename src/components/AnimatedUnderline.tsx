import React, { useRef, useEffect } from 'react';

interface AnimatedUnderlineProps {
  draw: boolean;
  className?: string;
}

export const AnimatedUnderline: React.FC<AnimatedUnderlineProps> = ({ draw, className }) => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (draw && pathRef.current) {
      const path = pathRef.current;
      const length = path.getTotalLength();
      path.style.transition = 'none';
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      // Force reflow
      void path.getBoundingClientRect();
      path.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)';
      path.style.strokeDashoffset = '0';
    } else if (pathRef.current) {
      const path = pathRef.current;
      const length = path.getTotalLength();
      path.style.transition = 'none';
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    }
  }, [draw]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 300"
      className={className}
      style={{ width: '100%', height: '100px', display: 'block' }}
    >
      <defs>
        <linearGradient id="SvgjsLinearGradient1001">
          <stop stopColor="hsl(230, 55%, 50%)" offset="0" />
          <stop stopColor="hsl(207, 98%, 40%)" offset="1" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d="M13.901345252990723,27.71299743652344C142.3019429842631,27.26456705729166,784.4544084866842,20.8370615641276,784.304931640625,25.0224151611328C784.1554547945658,29.20776875813803,13.004484176635742,50.43348948160806,13.004484176635742,52.8251190185547C13.004484176635742,55.2167485555013,655.7548570632935,41.61434682210287,784.304931640625,39.3721923828125"
        fill="none"
        strokeWidth="15"
        stroke="url(#SvgjsLinearGradient1001)"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default AnimatedUnderline; 