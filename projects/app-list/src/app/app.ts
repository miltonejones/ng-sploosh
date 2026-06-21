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
  searchParam = signal<string>('');
  persisted = signal<PersistedSearches>({
    pinned: [],
    unpinned: [],
  });

  constructor(
    public sharedService: SharedStateService,
    public persistSvc: SearchPersist,
    public route: ActivatedRoute,
  ) {}

  async refresh(param: string) {
    const persisted = await this.persistSvc.getSearchesAsync();
    // alert(JSON.stringify(persisted));
    this.persisted.set(persisted); //this.persistSvc.getSearches();
    this.open.set(true);
    // this.searchParam.set(param);
  }

  ngOnInit(): void {
    this.sharedService.listOpen.subscribe((param: string) => {
      this.refresh(param);
    });

    this.sharedService.searchUpdate.subscribe((param: string) => {
      this.searchParam.set(param);
    });
  }

  closeWindow() {
    this.open.set(false);
  }

  async pinSearch(term: string) {
    await this.persistSvc.pinSearchTerm(term);
    await this.refresh(this.searchParam());
  }
  async unpinSearch(term: string) {
    await this.persistSvc.unpinSearchTerm(term);
    await this.refresh(this.searchParam());
  }
}
