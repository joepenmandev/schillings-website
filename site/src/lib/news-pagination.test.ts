import { describe, expect, it } from 'vitest';
import { newsPaginationItems } from './news-pagination';

describe('newsPaginationItems', () => {
  it('returns empty when fewer than 2 pages', () => {
    expect(newsPaginationItems(1, 1)).toEqual([]);
  });

  it('lists all pages when total is small', () => {
    expect(newsPaginationItems(2, 5)).toEqual([
      { kind: 'page', page: 1 },
      { kind: 'page', page: 2 },
      { kind: 'page', page: 3 },
      { kind: 'page', page: 4 },
      { kind: 'page', page: 5 },
    ]);
  });

  it('uses ellipses for large totals', () => {
    const items = newsPaginationItems(10, 40);
    expect(items.some((x) => x.kind === 'ellipsis')).toBe(true);
    expect(items.filter((x) => x.kind === 'page' && x.page === 1).length).toBe(1);
    expect(items.filter((x) => x.kind === 'page' && x.page === 40).length).toBe(1);
    expect(items.filter((x) => x.kind === 'page' && x.page === 10).length).toBe(1);
  });
});
