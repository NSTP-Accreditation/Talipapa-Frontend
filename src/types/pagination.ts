export interface PaginationInterface<T> {
  count: number;
  currentPage: number;
  data: T[],
  hasNextPage: boolean;
  hasPrevPage: boolean;
  sort: string;
  total: number;
  totalPage: number
}