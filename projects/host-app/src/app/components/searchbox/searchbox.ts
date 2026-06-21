import { Component, inject, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container d-flex gap-1">
      <input
        type="text"
        class="form-control"
        placeholder="Search..."
        [(ngModel)]="searchParam"
        (keydown.enter)="onSearch()"
        autofocus
      />
    </div>
  `,
  styles: [
    `
      .search-container {
        max-width: 400px;
        margin: 1rem auto;
        padding-right: 1rem;
      }
    `,
  ],
})
export class SearchComponent {
  private router = inject(Router);
  target = input<string>('/find');
  searchParam = '';
  // private route = inject(ActivatedRoute);

  constructor(public route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      // debugger;
      this.searchParam = params['searchParam'];
    });

    const urlParams = new URLSearchParams(window.location.search);
    console.log({ urlParams });
  }

  onSearch(): void {
    const isModel = window.location.href.indexOf('models') > 0;
    const tag = isModel ? '/models' : '/find';

    const trimmed = this.searchParam.trim();
    // debugger;
    if (trimmed) {
      this.router.navigate([tag, trimmed, 1]);
    }
  }
}
