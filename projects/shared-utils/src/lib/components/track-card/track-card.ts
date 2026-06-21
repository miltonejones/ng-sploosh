import {
  Component,
  computed,
  input,
  OnChanges,
  OnInit,
  output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { LaunchWindow, ModelInfo, TrackInfo } from '../../models';
import { DropMenuItem } from '../dropmenu/dropmenu';
import { RegionMenuComponent } from '../window-region/window-region';
import { ActorMenu } from '../actor-menu/actor-menu';
import { ImageSource } from '../../directives/image-source';
import { ThumbnailMenu } from '../thumbnail-menu/thumbnail-menu';
import { SharedUtils } from '../../shared-utils';

export interface LaunchInfo {
  index: number;
  url: string;
}

export interface MenuInfo {
  key: string;
  video: TrackInfo;
  studio?: string;
}

@Component({
  selector: 'lib-track-card',
  imports: [ImageSource, ActorMenu, ThumbnailMenu, RegionMenuComponent],
  templateUrl: './track-card.html',
  styleUrl: './track-card.css',
})
export class TrackCard implements OnInit, OnChanges {
  launched = input<LaunchWindow[]>([]);
  track = input<TrackInfo>();
  visited = input(false);
  display = input(false);
  modelSelect = output<number>();
  regionSelect = output<LaunchInfo>();
  isWide = false;
  isOpen = signal(false);
  isMenu = signal(false);
  items: DropMenuItem[] = [];
  studio = '';
  models = computed(() => {
    const t = this.track();
    return t?.models ? [...t.models] : []; // Spread to create new array
  });
  itemClicked = output<MenuInfo>();

  model = computed(() => {
    const t = this.track();
    if (!t?.models?.length) return undefined;
    return t.models[0];
  });

  constructor(private utils: SharedUtils) {}

  get studioName(): string {
    if (!this.track()) return '';
    // this.model = this.track()?.models[0];
    const match = /([a-zA-Z]+)-\d+/.exec(this.track()?.title!);
    if (!match) return '';
    return match[1];
  }

  setMenu(value: boolean) {
    this.isMenu.set(value);
  }

  setMenuItems() {
    this.items = this.utils.getMenuItems(this.track());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['track']) {
      this.setMenuItems();
    }
  }

  ngOnInit(): void {
    if (!this.track()) return;
    // this.model = this.track()?.models[0];
    this.setMenuItems();
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   this.setMenuItems();
  // }

  handleMenuClick(key: string) {
    if (!this.track()) return;
    this.itemClicked.emit({
      key,
      video: this.track()!,
      studio: this.track()?.studio,
    });
  }

  handleEditClick() {
    this.itemClicked.emit({
      key: 'edit',
      video: this.track()!,
    });
  }

  setOpen() {
    if (this.display()) return;
    this.isOpen.update((f) => !f);
  }

  setWide(wide: boolean) {
    this.isWide = wide;
  }

  selectModel(id: number) {
    this.modelSelect.emit(id);
  }

  selectRegion(index: number) {
    this.regionSelect.emit({
      index,
      url: this.track()?.URL!,
    });
    setTimeout(() => {
      this.isOpen.set(false);
    }, 0);
  }
}
