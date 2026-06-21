import { Injectable } from '@angular/core';
import { SEARCH_SEED } from './constants';
import { DynamoStorageService } from './dynamo-storage.service';

export interface PersistedSearches {
  pinned: string[];
  unpinned: string[];
}

@Injectable({
  providedIn: 'root',
})
export class SearchPersist {
  COOKIE_NAME = 'saved-searches';
  cookieName = 'saved-video-app-searches-db';

  constructor(private store: DynamoStorageService) {}

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

  async getSearchesAsync(): Promise<PersistedSearches> {
    const str = await this.store.getItemAsync(this.COOKIE_NAME);
    // console.log('str', str);
    if (!!str) {
      const persisted = JSON.parse(str);
      // console.log({ persisted });
      if (persisted.hasOwnProperty('pinned')) return persisted;
      const out = {
        pinned: [],
        unpinned: persisted,
      };
      // console.log({ out });
      return out;
    }

    const fin = {
      pinned: [],
      unpinned: SEARCH_SEED,
    };
    // console.log({ fin });
    return fin;

    // const persisted = localStorage.getItem(this.COOKIE_NAME);
    // if (persisted) {
    //   return JSON.parse(persisted);
    // }

    // return searchTabs;
  }

  async save(searches: PersistedSearches): Promise<any> {
    return new Promise((resolve) => {
      this.store.setItem(this.COOKIE_NAME, JSON.stringify(searches)).subscribe(resolve);
    });
  }

  async pinSearchTerm(term: string): Promise<any> {
    const existing = await this.getSearchesAsync();
    const unpinned = existing.unpinned.filter((f) => f !== term);
    const pinned = existing.pinned.concat(term);
    const searches: PersistedSearches = {
      pinned,
      unpinned,
    };
    return await this.save(searches);
  }

  async unpinSearchTerm(term: string): Promise<any> {
    const existing = await this.getSearchesAsync();
    const pinned = existing.pinned.filter((f) => f !== term);
    const unpinned = existing.unpinned.concat(term);
    const searches: PersistedSearches = {
      pinned,
      unpinned,
    };
    return await this.save(searches);
  }

  async removeSearchTerm(term: string): Promise<any> {
    const existing = await this.getSearchesAsync();
    const pinned = existing.pinned.filter((f) => f !== term);
    const unpinned = existing.unpinned.filter((f) => f !== term);
    const searches: PersistedSearches = {
      pinned,
      unpinned,
    };
    return await this.save(searches);
  }

  async addSearchTerm(term: string): Promise<any> {
    const existing = await this.getSearchesAsync();
    const pinned = existing.pinned;
    const unpinned = existing.unpinned.concat(term);
    const searches: PersistedSearches = {
      pinned,
      unpinned,
    };
    return await this.save(searches);
  }
}
