// ...existing code...
export const paginate = (total: number, perPage: number, currentPage: number) => ({
  total,
  perPage,
  currentPage,
  lastPage: Math.ceil(total / perPage),
});
// ...existing code...
