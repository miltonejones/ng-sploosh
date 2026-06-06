import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SEARCH_SEED, SharedStateService, PersistedSearches, SearchPersist } from 'shared-utils';
@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  open = signal(false);
  searchParams: string[] = SEARCH_SEED;
  searchParam = signal('');
  persisted: PersistedSearches = {
    pinned: [],
    unpinned: [],
  };

  constructor(
    public sharedService: SharedStateService,
    public persistSvc: SearchPersist,
    public route: ActivatedRoute
  ) {}

  refresh(param: string) {
    this.persisted = this.persistSvc.getSearches();
    this.open.set(true);
    // this.searchParam.set(param);
  }

  ngOnInit(): void {
    this.sharedService.listOpen.subscribe((param) => {
      this.refresh(param);
    });

    this.sharedService.searchUpdate.subscribe((param) => {
      this.searchParam.set(param);
    });
  }

  closeWindow() {
    this.open.set(false);
  }

  pinSearch(term: string) {
    this.persistSvc.pinSearchTerm(term);
    this.refresh(this.searchParam());
  }
  unpinSearch(term: string) {
    this.persistSvc.unpinSearchTerm(term);
    this.refresh(this.searchParam());
  }
}
