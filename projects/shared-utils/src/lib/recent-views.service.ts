import { Injectable } from '@angular/core';
import { recentViews } from './recent-views';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecentViewsService {
  COOKIE_NAME = 'recent-views';
  recentUpdated = new Subject<boolean>();

  getRecent(): number[] {
    const persisted = localStorage.getItem(this.COOKIE_NAME);
    if (persisted) {
      return JSON.parse(persisted);
    }

    return recentViews;
  }

  addRecent(id: number) {
    const existing = this.getRecent();
    const truncated = existing.filter((f) => f !== id);
    const views = [id, ...truncated];
    console.log({ views });
    localStorage.setItem(this.COOKIE_NAME, JSON.stringify(views));
    this.recentUpdated.next(true);
  }
  dropRecent(id: number) {
    const existing = this.getRecent();
    const truncated = existing.filter((f) => f !== id);
    localStorage.setItem(this.COOKIE_NAME, JSON.stringify(truncated));
    this.recentUpdated.next(true);
  }
}
