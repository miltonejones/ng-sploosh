import { Injectable } from '@angular/core';
import { recentViews } from './recent-views';
import { Subject } from 'rxjs';
import { DynamoStorageService } from './dynamo-storage.service';

@Injectable({
  providedIn: 'root',
})
export class RecentViewsService {
  COOKIE_NAME = 'recent-views';
  cookieName = 'video-recent-watched-id-list';

  recentUpdated = new Subject<boolean>();
  constructor(private store: DynamoStorageService) {}

  getRecent(): number[] {
    const persisted = localStorage.getItem(this.COOKIE_NAME);
    if (persisted) {
      return JSON.parse(persisted);
    }

    return recentViews;
  }

  async getRecentAsync(): Promise<number[]> {
    return new Promise((resolve) => {
      this.store.getItem(this.cookieName).subscribe((res) => {
        if (res) {
          resolve(JSON.parse(res));
          return;
        }
        resolve(recentViews);
      });
    });
  }

  async save(nums: number[]) {
    return new Promise((resolve) => {
      this.store.setItem(this.cookieName, JSON.stringify(nums)).subscribe(resolve);
    });
  }

  async addRecent(id: number) {
    const existing = await this.getRecentAsync();
    const truncated = existing.filter((f) => f !== id);
    const views = [id, ...truncated];
    console.log({ views });
    // localStorage.setItem(this.COOKIE_NAME, JSON.stringify(views));
    await this.save(views);
    this.recentUpdated.next(true);
  }
  async dropRecent(id: number) {
    const existing = await this.getRecentAsync();
    const truncated = existing.filter((f) => f !== id);
    // localStorage.setItem(this.COOKIE_NAME, JSON.stringify(truncated));
    await this.save(truncated);
    this.recentUpdated.next(true);
  }
}
