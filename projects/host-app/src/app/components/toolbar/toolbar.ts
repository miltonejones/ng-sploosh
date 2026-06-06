import { Component, inject, output, signal } from '@angular/core';
import { SearchComponent } from '../searchbox/searchbox';
import { ActivatedRoute } from '@angular/router';
import { NavButtons } from '../nav-buttons/nav-buttons';

@Component({
  selector: 'app-toolbar',
  imports: [SearchComponent, NavButtons],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class Toolbar {
  private route = inject(ActivatedRoute);
  searchParam = signal('');
  menuClick = output();

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.searchParam.set(params['searchParam']);
    });
  }

  openMenu() {
    this.menuClick.emit();
  }

  getParam() {
    return;
  }
}
