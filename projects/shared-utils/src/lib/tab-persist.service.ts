import { Injectable } from '@angular/core';
import { searchTabs } from './search-tabs';
import { DynamoStorageService } from './dynamo-storage.service';

export interface SearchTab {
  param: string;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class TabPersistService {
  COOKIE_NAME = 'search-tabs';
  cookieName = 'saved-video-app-searches-db';

  constructor(private store: DynamoStorageService) {}

  getTabs(): SearchTab[] {
    const persisted = localStorage.getItem(this.COOKIE_NAME);
    if (persisted) {
      return JSON.parse(persisted);
    }

    return searchTabs;
  }

  async getTabsAsync(): Promise<SearchTab[]> {
    return new Promise((resolve) => {
      this.store.getItem(this.COOKIE_NAME).subscribe((res) => {
        if (res) {
          resolve(JSON.parse(res));
          return;
        }
        resolve(searchTabs);
      });
    });
  }

  async save(content: SearchTab[]) {
    return new Promise((resolve) => {
      this.store.setItem(this.COOKIE_NAME, JSON.stringify(content)).subscribe(resolve);
    });
  }

  async removeTab(term: string) {
    const existing = await this.getTabsAsync();
    if (!existing) return;
    const truncated = existing.filter((f) => f.param !== term);
    // localStorage.setItem(this.COOKIE_NAME, JSON.stringify(truncated));
    return await this.save(truncated);
  }

  async applyTab(parameter: string, type: string = 'search') {
    const existing = await this.getTabsAsync();
    if (!existing) return;
    const param = parameter.replace('*', '');
    const found = existing.find((f) => f.param === param);
    if (!found) {
      const extended = existing.concat({
        param,
        type,
      });
      // localStorage.setItem(this.COOKIE_NAME, JSON.stringify(extended));
      await this.save(extended);
    }
  }
}
