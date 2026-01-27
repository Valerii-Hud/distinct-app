export const formateDate = (date: string | undefined) => {
  if (typeof date !== 'string') return;
  return new Date(date).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
