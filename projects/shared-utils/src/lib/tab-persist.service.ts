import { Injectable } from '@angular/core';
import { searchTabs } from './search-tabs';

export interface SearchTab {
  param: string;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class TabPersistService {
  COOKIE_NAME = 'search-tabs';

  getTabs(): SearchTab[] {
    const persisted = localStorage.getItem(this.COOKIE_NAME);
    if (persisted) {
      return JSON.parse(persisted);
    }

    return searchTabs;
  }

  removeTab(term: string) {
    const existing = this.getTabs();
    const truncated = existing.filter((f) => f.param !== term);
    localStorage.setItem(this.COOKIE_NAME, JSON.stringify(truncated));
  }

  applyTab(param: string, type: string = 'search') {
    const existing = this.getTabs();
    const found = existing.find((f) => f.param === param);
    if (!found) {
      const extended = existing.concat({
        param,
        type,
      });
      localStorage.setItem(this.COOKIE_NAME, JSON.stringify(extended));
    }
  }
}
