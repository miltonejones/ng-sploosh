import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
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
  searchParam = '';

  onSearch(): void {
    const trimmed = this.searchParam.trim();
    // debugger;
    if (trimmed) {
      this.router.navigate(['/find', trimmed, 1]);
    }
  }
}
