import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TrackInfo } from './models';
import { MenuInfo, ModalEventService, SharedStateService, VideoApiService } from '../public-api';

@Injectable({
  providedIn: 'root',
})
export class SharedUtils {
  constructor(
    private modal: ModalEventService,
    private videoSvc: VideoApiService,
    private sharedSvc: SharedStateService,
    private router: Router,
  ) {}

  async handleItemClick(info: MenuInfo) {
    switch (info.key) {
      case 'studio':
        if (!info.video.studio) {
          await this.modal.alert(JSON.stringify(info), 'Cannot find studio');
          break;
        }
        this.router.navigate(['/find', info.video.studio! + '-', 1]);
        break;
      case 'google':
        window.open(`https://www.google.com/search?q=${info.video.Key}`);
        break;
      case 'info':
        const menu = this.getMenuItems(info.video);
        const answer = await this.modal.alert(
          info.video.title,
          'Video Info',
          info.video.image!,
          menu,
        );
        if (answer.key) {
          this.handleItemClick({
            ...info,
            key: answer.key,
          });
          break;
        }
        break;
      case 'jav':
        if (!info.video.Key) {
          break;
        }
        window.open(`https://www.javlibrary.com/en/vl_searchbyid.php?keyword=${info.video.Key}`);
        break;
      case 'open':
        window.open(info.video.URL);
        break;
      case 'drop':
        const ok = await this.modal.confirm(`Are you sure you want to delete ${info.video.title}`);
        if (!ok.ok) break;
        this.videoSvc.deleteVideo(info.video.ID).subscribe(() => {
          this.sharedSvc.refreshVideo();
        });
        break;
      case 'fave':
        this.videoSvc.toggleVideoFavorite(info.video.ID).subscribe((response) => {
          this.sharedSvc.refreshVideo();
        });
        break;
      case 'edit':
        this.sharedSvc.selectVideo(info.video.ID);
        break;
      default:
      // do nothing
    }
  }

  getMenuItems(track?: TrackInfo) {
    if (!track) return [];
    const isOk = track.favorite;
    const items = [
      {
        label: '',
        key: 'none',
      },
      {
        label: 'Edit video',
        icon: 'fa-pen',
        key: 'edit',
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

    if (track.Key) {
      items.push({
        label: `Google search "${track.Key}"`,
        icon: 'fa-magnifying-glass',
        key: 'google',
      });
    }

    if (track.studio) {
      items.push(
        {
          label: '',
          key: 'none',
        },
        {
          label: `Open all videos from ${track.studio}`,
          key: 'studio',
          icon: 'fa-square-arrow-up-right',
        },
      );
    }

    return items;
  }
}
