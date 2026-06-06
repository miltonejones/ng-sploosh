import { Injectable } from '@angular/core';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  visiblePages: number[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PageLink {
  pageNumber?: number;
  pageLink: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  /**
   * Returns an array of visible page numbers centered around the current page.
   *
   * @param pageNum     - The current (1-based) page number.
   * @param pageSize    - Number of records per page.
   * @param recordCount - Total number of records.
   * @param maxVisible  - Max page buttons to show (default 5). Must be odd for
   *                      symmetric windowing; the service rounds up if even.
   * @returns           Sorted array of visible 1-based page numbers.
   */
  getVisiblePages(
    pageNum: number,
    pageSize: number,
    recordCount: number,
    maxVisible: number = 5
  ): number[] {
    const totalPages = this.getTotalPages(pageSize, recordCount);

    if (totalPages <= 0) return [];

    // Clamp current page to valid range
    const current = Math.max(1, Math.min(pageNum, totalPages));

    // Ensure window size is at least 1 and odd for symmetric centering
    const windowSize = Math.max(1, maxVisible % 2 === 0 ? maxVisible + 1 : maxVisible);

    if (totalPages <= windowSize) {
      // All pages fit — show them all
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(windowSize / 2);
    let start = current - half;
    let end = current + half;

    // Shift window if it goes below page 1
    if (start < 1) {
      start = 1;
      end = windowSize;
    }

    // Shift window if it goes above the last page
    if (end > totalPages) {
      end = totalPages;
      start = totalPages - windowSize + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  getPageLinks(
    pageNum: number,
    pageSize: number,
    recordCount: number,
    maxVisible: number = 5
  ): PageLink[] {
    const pages = this.getVisiblePages(pageNum, pageSize, recordCount, maxVisible);
    const totalPages = this.getTotalPages(pageSize, recordCount);
    const pageLinks: PageLink[] = [];

    if (pages.indexOf(2) < 0) {
      pageLinks.push(
        {
          pageLink: '1',
          pageNumber: 1,
        },
        {
          pageLink: '...',
        }
      );
    }

    pages.forEach((page) => {
      pageLinks.push({
        pageLink: page.toString(),
        pageNumber: page,
      });
    });

    if (pages.indexOf(totalPages) < 0) {
      const lastPage = pages[pages.length - 1];
      if (totalPages - lastPage > 2) {
        pageLinks.push({
          pageLink: '...',
        });
      }
      pageLinks.push({
        pageLink: totalPages.toString(),
        pageNumber: totalPages,
      });
    }

    return pageLinks;
  }

  /**
   * Returns a full PaginationState object with all derived values.
   */
  getPaginationState(
    pageNum: number,
    pageSize: number,
    recordCount: number,
    maxVisible: number = 5
  ): PaginationState {
    const totalPages = this.getTotalPages(pageSize, recordCount);
    const currentPage = Math.max(1, Math.min(pageNum, totalPages || 1));

    return {
      currentPage,
      pageSize,
      totalRecords: recordCount,
      totalPages,
      visiblePages: this.getVisiblePages(pageNum, pageSize, recordCount, maxVisible),
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    };
  }

  /** Calculates total pages from page size and record count. */
  getTotalPages(pageSize: number, recordCount: number): number {
    if (pageSize <= 0 || recordCount <= 0) return 0;
    return Math.ceil(recordCount / pageSize);
  }
}
