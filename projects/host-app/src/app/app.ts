import { Component, inject, Input, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { MfeAnchorComponent } from './components/mfe-anchor/mfe-anchor';
import {
  SharedStateService,
  APP_VERSION,
  ModalEventService,
  ModalBox,
  ModalResponse,
  WindowLauncherService,
  LaunchWindow,
  SnackBar,
} from 'shared-utils';
import { Toolbar } from './components/toolbar/toolbar';
@Component({
  selector: 'app-root',
  imports: [MfeAnchorComponent, RouterOutlet, Toolbar, ModalBox, SnackBar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('host-app');
  private route = inject(ActivatedRoute);
  multipleURLs = signal<string[]>([]);
  multipleCount = signal<number>(0);
  version = APP_VERSION;
  searchParam = signal('');
  expanded = signal(false);
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
  hidden = signal(true);
  sessionWindows = signal<LaunchWindow[]>([]);

  constructor(
    public sharedState: SharedStateService,
    private modal: ModalEventService,
    public launcher: WindowLauncherService,
  ) {}

  setExpanded(value: boolean) {
    this.expanded.set(value);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.searchParam.set(params['searchParam']);
    });
    this.sharedState.importComplete.subscribe(() => {
      this.addNextVideo();
    });
    this.sharedState.videoRefresh.subscribe(() => {
      this.resetSession();
    });
    this.launchSession();
  }

  async resetSession() {
    debugger;
    await this.launcher.updateLaunches();
    this.launchSession();
  }

  async launchSession() {
    // await this.launcher.updateLaunches();
    const panes = await this.launcher.getSavedLaunches();
    this.sessionWindows.set(panes.sort((a, b) => a.index - b.index));
  }

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

  addNextVideo() {
    const addresses = this.multipleURLs();
    const progress = 100 - Math.floor(100 * (addresses.length / this.multipleCount()));
    this.sharedState.setProgress(progress);
    const address = addresses.pop();
    if (!address) {
      this.sharedState.setProgress(0);
      this.multipleCount.set(0);
      // this.modal.alert('All videos added!', 'Success!');
      return;
    }
    this.multipleURLs.set(addresses);
    this.sharedState.addVideo(address);
  }

  handleResponse(res: ModalResponse) {
    if (!res.ok) return;
    if (res.messages?.length) {
      this.multipleCount.set(res.messages.length);
      this.multipleURLs.set(res.messages);
      this.addNextVideo();
      return;
    }
    !!res.message && this.sharedState.addVideo(res.message);
  }

  authenticateUser() {
    this.sharedState.updateUser({ username: 'Alice Smith', role: 'Administrator' });
  }

  openMenu() {
    this.sharedState.openList(this.searchParam());
  }

  async handleAddVideo() {
    const res = await this.modal.prompt('Enter video URL', 'Add video to library');
    this.handleResponse(res);
  }
}
