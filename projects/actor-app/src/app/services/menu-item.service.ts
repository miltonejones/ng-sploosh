import { Injectable } from '@angular/core';
import { MenuInfo, TrackInfo } from 'shared-utils';
@Injectable({
  providedIn: 'root',
})
export class MenuItemService {
  getMenuItems(track: TrackInfo) {
    const isOk = track.favorite;
    const items = [
      // {
      //   label: 'Video info',
      //   icon: 'fa-circle-info',
      //   key: 'info',
      // },
      {
        label: '',
        key: 'none',
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

    items.push(
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
      },
    );
    return items;
  }
}
