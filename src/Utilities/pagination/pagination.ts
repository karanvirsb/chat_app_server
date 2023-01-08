type props = {
  prevDate: Date;
  nextDate: Date | null;
  rows: unknown[];
};

interface ReturnPagination<T> {
  hasNextPage: boolean;
  cursor: Date | null;
  data: T[];
}
export default function pagination({
  prevDate,
  nextDate,
  rows,
}: props): ReturnPagination<unknown> {
  const hasNextPage = nextDate !== null;

  return {
    hasNextPage,
    cursor: nextDate ? prevDate : null,
    data: rows,
  };
}
