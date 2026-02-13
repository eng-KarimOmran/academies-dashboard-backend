export const getPaginationParams = ({
  limit,
  page,
  total,
}: {
  limit: number;
  page: number;
  total: number;
}) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const skip = (safePage - 1) * limit;

  return { totalPages, safePage, skip, limit: limit };
};