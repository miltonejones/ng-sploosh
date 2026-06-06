import { Injectable, signal } from '@angular/core';
import { UserState } from './models';
import { Subject } from 'rxjs';

export interface AddedVideoInfo {
  uri: string;
  modelFk: number;
}

@Injectable({
  providedIn: 'root',
})
export class SharedStateService {
  private userSignal = signal<UserState>({ username: 'Guest', role: 'Anonymous' });

  public user = this.userSignal.asReadonly();
  modelSelect = new Subject<number>();
  videoSelect = new Subject<number>();
  videoRefresh = new Subject<boolean>();
  listOpen = new Subject<string>();
  videoAdded = new Subject<string | AddedVideoInfo>();
  searchUpdate = new Subject<string>();
  importComplete = new Subject<boolean>();
  progress = new Subject<number>();

  updateUser(newUser: UserState) {
    this.userSignal.set(newUser);
  }

  selectModel(id: number) {
    this.modelSelect.next(id);
  }
  selectVideo(id: number) {
    this.videoSelect.next(id);
  }

  refreshVideo() {
    this.videoRefresh.next(false);
  }

  addVideo(param: string | AddedVideoInfo) {
    this.videoAdded.next(param);
  }

  openList(param: string) {
    this.listOpen.next(param);
  }

  completeImport(success: boolean) {
    this.importComplete.next(success);
  }
  setSearch(param: string) {
    this.searchUpdate.next(param);
  }
  setProgress(param: number) {
    this.progress.next(param);
  }
}
