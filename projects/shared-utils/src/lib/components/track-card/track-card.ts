import { Component, input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { LaunchWindow, ModelInfo, TrackInfo } from '../../models';
import { Dropmenu, DropMenuItem } from '../dropmenu/dropmenu';
import { RegionMenuComponent } from '../window-region/window-region';
import { ActorMenu } from '../actor-menu/actor-menu';
import { ImageSource } from '../../directives/image-source';

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
  imports: [ImageSource, ActorMenu, RegionMenuComponent, Dropmenu],
  templateUrl: './track-card.html',
  styleUrl: './track-card.css',
})
export class TrackCard implements OnInit, OnChanges {
  launched = input<LaunchWindow[]>([]);
  track = input<TrackInfo>();
  visited = input(false);
  modelSelect = output<number>();
  regionSelect = output<LaunchInfo>();
  isWide = false;
  isOpen = signal(false);
  items: DropMenuItem[] = [];
  studio = '';
  model?: ModelInfo;
  itemClicked = output<MenuInfo>();

  get studioName(): string {
    if (!this.track()) return '';
    this.model = this.track()?.models[0];
    const match = /([a-zA-Z]+)-\d+/.exec(this.track()?.title!);
    if (!match) return '';
    return match[1];
  }

  setMenuItems() {
    const isOk = this.track()?.favorite;
    this.items = [
      {
        label: 'Edit video',
        icon: 'fa-pen',
        key: 'edit',
      },
      {
        label: 'Video info',
        icon: 'fa-circle-info',
        key: 'info',
      },
      {
        label: isOk ? 'Remove from favorites' : 'Add to favorites',
        icon: 'fa-heart',
        key: 'fave',
        red: isOk,
      },
      {
        label: 'Delete video',
        icon: 'fa-trash-can',
        key: 'drop',
      },
      {
        label: 'Open video source',
        icon: 'fa-up-right-from-square',
        key: 'open',
      },

      {
        label: 'Find in JAVLibrary',
        icon: 'fa-book',
        key: 'jav',
      },
    ];

    if (this.track()?.Key) {
      this.items.push({
        label: `Google search "${this.track()?.Key}"`,
        icon: 'fa-magnifying-glass',
        key: 'google',
      });
    }

    if (this.studioName) {
      this.items.push(
        {
          label: '',
          key: 'none',
        },
        {
          label: `Open all videos from ${this.studioName}`,
          key: 'studio',
        }
      );
    }
  }

  ngOnInit(): void {
    if (!this.track()) return;
    this.model = this.track()?.models[0];
    this.setMenuItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setMenuItems();
  }

  handleMenuClick(key: string) {
    if (!this.track()) return;
    this.itemClicked.emit({
      key,
      video: this.track()!,
      studio: this.studioName,
    });
  }

  handleEditClick() {
    this.itemClicked.emit({
      key: 'edit',
      video: this.track()!,
    });
  }

  setOpen() {
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
