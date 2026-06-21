import { Component, input, output } from '@angular/core';
import { DropMenuItem } from '../dropmenu/dropmenu';

@Component({
  selector: 'lib-thumbnail-menu',
  imports: [],
  templateUrl: './thumbnail-menu.html',
  styleUrl: './thumbnail-menu.css',
})
export class ThumbnailMenu {
  items = input<DropMenuItem[]>([]);
  open = input(false);
  itemClicked = output<string>();

  clickItem(key: string) {
    this.itemClicked.emit(key);
  }
}
