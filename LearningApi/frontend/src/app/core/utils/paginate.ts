export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export type PaginationItem = number | 'ellipsis';

export function getPaginationItems(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PaginationItem[] {
  const safeTotal = Math.max(1, totalPages);
  const safeCurrent = Math.min(Math.max(1, currentPage), safeTotal);
  const visibleSlots = siblingCount * 2 + 5;

  if (safeTotal <= visibleSlots) {
    return Array.from({ length: safeTotal }, (_, index) => index + 1);
  }

  const leftSibling = Math.max(safeCurrent - siblingCount, 2);
  const rightSibling = Math.min(safeCurrent + siblingCount, safeTotal - 1);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < safeTotal - 1;
  const items: PaginationItem[] = [1];

  if (showLeftEllipsis) {
    items.push('ellipsis');
  } else {
    for (let page = 2; page < leftSibling; page++) {
      items.push(page);
    }
  }

  for (let page = leftSibling; page <= rightSibling; page++) {
    items.push(page);
  }

  if (showRightEllipsis) {
    items.push('ellipsis');
  } else {
    for (let page = rightSibling + 1; page < safeTotal; page++) {
      items.push(page);
    }
  }

  items.push(safeTotal);
  return items;
}
