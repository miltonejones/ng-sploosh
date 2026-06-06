import { Component, input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import {
  TrackInfo,
  RegionMenuComponent,
  Dropmenu,
  DropMenuItem,
  ActorInfo,
  LaunchWindow,
} from 'shared-utils';
import { ImageSource } from '../../directives/image-source';
import { ActorMenu } from '../actor-menu/actor-menu';

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
  selector: 'app-actor-video-card',
  imports: [ImageSource, RegionMenuComponent, Dropmenu, ActorMenu],
  templateUrl: './actor-video-card.html',
  styleUrl: './actor-video-card.css',
})
export class ActorVideoCard implements OnChanges {
  launched = input<LaunchWindow[]>([]);
  isOpen = signal(false);
  track = input<TrackInfo>();
  visited = input<boolean>(false);
  regionSelect = output<LaunchInfo>();
  items: DropMenuItem[] = [];
  itemClicked = output<MenuInfo>();
  actors: ActorInfo[] = [];
  modelClicked = output<ActorInfo>();
  dedupe = output<number>();
  isWide = true;
  actorId = input<number>();

  ngOnInit(): void {
    this.setMenuItems();
  }

  dedupeModel(id: number) {
    this.dedupe.emit(this.track()?.ID!);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setMenuItems();
    this.setVideoModels();
  }

  selectModel(model: ActorInfo) {
    this.modelClicked.emit(model);
  }

  setMenuItems() {
    const isOk = this.track()?.favorite;
    this.items = [
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

    this.items.push(
      {
        label: 'Remove model from video',
        icon: 'fa-user-times',
        key: 'decast',
      },
      {
        label: '',
        key: 'none',
      },
      {
        label: 'Set model photo',
        icon: 'fa-image',
        key: 'photo',
      }
    );
  }

  setVideoModels() {
    if (!this.track()) return;
    this.actors = this.track()!.models!.map((f) => {
      const info: ActorInfo = {
        name: f.Name,
        image: f.image!,
        ID: f.ID,
      };
      return info;
    });

    this.isWide = this.actors.length < 2;
  }

  handleMenuClick(key: string) {
    if (!this.track()) return;
    this.itemClicked.emit({
      key,
      video: this.track()!,
      studio: this.track()?.studio,
    });
  }

  setOpen() {
    // if (this.isOpen()) return;
    this.isOpen.update((f) => !f);
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
