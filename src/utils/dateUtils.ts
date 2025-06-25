export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const isToday = (date: string) => {
  const today = new Date();
  const checkDate = new Date(date);
  return checkDate.toDateString() === today.toDateString();
};

export const isThisWeek = (date: string) => {
  const today = new Date();
  const checkDate = new Date(date);
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
  return checkDate >= weekStart && checkDate <= weekEnd;
};

export const isThisMonth = (date: string) => {
  const today = new Date();
  const checkDate = new Date(date);
  return checkDate.getMonth() === today.getMonth() && 
         checkDate.getFullYear() === today.getFullYear();
};

export const getLast30Days = () => {
  const dates = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};