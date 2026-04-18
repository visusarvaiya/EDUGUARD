export const getRiskColor = (score) => {
  if (score >= 65) return '#ef4444'; // red
  if (score >= 40) return '#f59e0b'; // amber
  return '#22c55e'; // green
};

export const getRiskLevel = (score) => {
  if (score >= 65) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
};

export const getRiskBgColor = (score) => {
  if (score >= 65) return 'bg-red-50 border-red-200';
  if (score >= 40) return 'bg-yellow-50 border-yellow-200';
  return 'bg-green-50 border-green-200';
};

export const getRiskBadgeColor = (score) => {
  if (score >= 65) return 'bg-red-100 text-red-800';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
