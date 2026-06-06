import { Component, input, output } from '@angular/core';

export interface DropMenuItem {
  label: string;
  icon?: string;
  key: string;
  red?: boolean;
}

@Component({
  selector: 'lib-dropmenu',
  imports: [],
  templateUrl: './dropmenu.html',
  styleUrl: './dropmenu.css',
})
export class Dropmenu {
  items = input<DropMenuItem[]>([]);
  label = input('');
  itemClicked = output<string>();

  clickItem(key: string) {
    this.itemClicked.emit(key);
  }
}
