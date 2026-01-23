import { useMemo } from 'react';

interface DotMatrixProps {
  rows?: number;
  cols?: number;
  className?: string;
  pattern?: 'random' | 'gradient' | 'wave';
}

export const DotMatrix = ({ 
  rows = 15, 
  cols = 20, 
  className = '',
  pattern = 'random'
}: DotMatrixProps) => {
  
  const dots = useMemo(() => {
    const generateOpacity = (row: number, col: number) => {
      switch (pattern) {
        case 'gradient':
          return 0.3 + (col / cols) * 0.7;
        case 'wave':
          return 0.2 + Math.sin((row + col) * 0.3) * 0.3 + 0.3;
        case 'random':
        default:
          return Math.random() * 0.6 + 0.2;
      }
    };

    const result = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const opacity = generateOpacity(row, col);
        const size = 3 + Math.random() * 3;
        result.push({
          key: `${row}-${col}`,
          cx: col * 24 + 12,
          cy: row * 24 + 12,
          r: size / 2,
          opacity,
          delay: Math.random() * 3,
        });
      }
    }
    return result;
  }, [rows, cols, pattern]);

  return (
    <svg 
      className={`text-black  ${className}`}
      viewBox={`0 0 ${cols * 24} ${rows * 24}`}
      preserveAspectRatio="xMidYMid slice"
    >
      {dots.map((dot) => (
        <circle
          key={dot.key}
          cx={dot.cx}
          cy={dot.cy}
          r={dot.r}
          fill = "currentColor"
          opacity={dot.opacity}
        />
      ))}
    </svg>
  );
};
