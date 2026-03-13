interface RiskBadgeProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  className?: string;
}

export default function RiskBadge({ level, className = '' }: RiskBadgeProps) {
  const colors = {
    LOW: 'bg-green-500/20 text-green-300 border-green-500/50 shadow-green-500/20',
    MEDIUM: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50 shadow-yellow-500/20',
    HIGH: 'bg-red-500/20 text-red-300 border-red-500/50 shadow-red-500/20',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border-2 shadow-lg ${colors[level]} ${className}`}
    >
      {level}
    </span>
  );
}
