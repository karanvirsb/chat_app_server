type props = {
  page: number;
  limit: number;
  count: number;
  rows: unknown[];
};

interface ReturnPagination<T> {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  data: T[];
}
export default function pagination({
  page,
  limit,
  count,
  rows,
}: props): ReturnPagination<unknown> {
  const hasNextPage = count - page * limit > 0;
  const hasPrevPage = page > 1;
  return {
    hasNextPage,
    hasPrevPage,
    data: rows,
  };
}
