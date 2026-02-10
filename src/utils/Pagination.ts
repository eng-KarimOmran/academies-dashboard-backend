export const getPaginationParams = (query: Record<string, unknown>) => {
  const { page = 1, limit = 10 } = query;
  
  const p = Math.max(1, Number(page));
  const l = Math.min(50, Number(limit));
  const skip = (p - 1) * l;

  return {
    page: p,
    limit: l,
    skip,
  };
};
