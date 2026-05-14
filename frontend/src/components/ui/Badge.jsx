export const STATUS_CONFIG = {
  'Pending': {
    label: 'Pending',
    className: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
    dot: 'bg-yellow-400',
  },
  'In Progress': {
    label: 'In Progress',
    className: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    dot: 'bg-blue-400',
  },
  'Completed': {
    label: 'Completed',
    className: 'bg-green-500/15 text-green-400 border border-green-500/30',
    dot: 'bg-green-400',
  },
};

export const PRIORITY_CONFIG = {
  'Low': {
    label: 'Low',
    className: 'bg-gray-500/15 text-gray-400 border border-gray-500/30',
    dot: 'bg-gray-400',
  },
  'Medium': {
    label: 'Medium',
    className: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
    dot: 'bg-orange-400',
  },
  'High': {
    label: 'High',
    className: 'bg-red-500/15 text-red-400 border border-red-500/30',
    dot: 'bg-red-400',
  },
};

const Badge = ({ type, value }) => {
  const config = type === 'status' ? STATUS_CONFIG[value] : PRIORITY_CONFIG[value];
  if (!config) return null;

  return (
    <span className={`badge ${config.className} gap-1.5`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default Badge;
