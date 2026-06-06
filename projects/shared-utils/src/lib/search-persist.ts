import { Injectable } from '@angular/core';
import { SEARCH_SEED } from './constants';

export interface PersistedSearches {
  pinned: string[];
  unpinned: string[];
}

@Injectable({
  providedIn: 'root',
})
export class SearchPersist {
  COOKIE_NAME = 'saved-searches';

  getSearches(): PersistedSearches {
    const persisted = localStorage.getItem(this.COOKIE_NAME);
    if (persisted) {
      return JSON.parse(persisted);
    }

    return {
      pinned: [],
      unpinned: SEARCH_SEED,
    };
  }

  pinSearchTerm(term: string) {
    const existing = this.getSearches();
    const unpinned = existing.unpinned.filter((f) => f !== term);
    const pinned = existing.pinned.concat(term);
    const searches: PersistedSearches = {
      pinned,
      unpinned,
    };
    localStorage.setItem(this.COOKIE_NAME, JSON.stringify(searches));
  }

  unpinSearchTerm(term: string) {
    const existing = this.getSearches();
    const pinned = existing.pinned.filter((f) => f !== term);
    const unpinned = existing.unpinned.concat(term);
    const searches: PersistedSearches = {
      pinned,
      unpinned,
    };
    localStorage.setItem(this.COOKIE_NAME, JSON.stringify(searches));
  }

  removeSearchTerm(term: string) {
    const existing = this.getSearches();
    const pinned = existing.pinned.filter((f) => f !== term);
    const unpinned = existing.unpinned.filter((f) => f !== term);
    const searches: PersistedSearches = {
      pinned,
      unpinned,
    };
    localStorage.setItem(this.COOKIE_NAME, JSON.stringify(searches));
  }

  addSearchTerm(term: string) {
    const existing = this.getSearches();
    const pinned = existing.pinned;
    const unpinned = existing.unpinned.concat(term);
    const searches: PersistedSearches = {
      pinned,
      unpinned,
    };
    localStorage.setItem(this.COOKIE_NAME, JSON.stringify(searches));
  }
}
