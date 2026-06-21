import { Component, input, output, signal } from '@angular/core';
import { SharedStateService } from '../../shared-state.service';
import { WindowLauncherService } from '../../window-launcher';

@Component({
  selector: 'lib-snack-bar',
  imports: [],
  templateUrl: './snack-bar.html',
  styleUrl: './snack-bar.css',
})
export class SnackBar {
  fixed = input(true);
  hidden = signal(true);
  menu = [
    {
      label: 'Focus all windows',
      icon: 'fa-solid fa-users-viewfinder',
      key: 'focus',
    },
    {
      label: 'Close all windows',
      icon: 'fa-solid fa-xmark',
      key: 'close',
    },
    {
      label: 'Refresh',
      icon: 'fa-solid fa-rotate',
      key: 'refresh',
    },
  ];
  add = output();

  constructor(
    public sharedState: SharedStateService,
    public launcher: WindowLauncherService,
  ) {}

  setHidden(hide: boolean) {
    this.hidden.set(hide);
  }

  handleMenu(key: string) {
    switch (key) {
      case 'focus':
        this.launcher.focusAll();
        break;
      case 'close':
        this.launcher.closeAll();
        break;
      case 'refresh':
        this.sharedState.refreshVideo();
        break;
      default:
      // do nothing
    }
  }

  handleAddVideo() {
    this.add.emit();
  }
}
