export const formatDate = (
  dateString: string
): { day: number; month: string; weekday: string } => {
  const date = new Date(dateString);

  return {
    day: date.getDate(),
    month: date.toLocaleString("en-US", { month: "short" }),
    weekday: date.toLocaleString("en-US", { weekday: "short" }),
  };
};
