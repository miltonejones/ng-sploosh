import { Component, inject, input, output, signal } from '@angular/core';
import { SearchComponent } from '../searchbox/searchbox';
import { ActivatedRoute } from '@angular/router';
import { NavButtons } from '../nav-buttons/nav-buttons';
import {
  ImageSource,
  RegionMenuComponent,
  LaunchWindow,
  VideoApiService,
  SharedStateService,
  ModalEventService,
  SharedUtils,
} from 'shared-utils';

@Component({
  selector: 'app-toolbar',
  imports: [SearchComponent, NavButtons, ImageSource, RegionMenuComponent],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class Toolbar {
  private route = inject(ActivatedRoute);
  sessionWindows = input<LaunchWindow[]>([]);
  searchParam = signal('');
  menuClick = output();
  sessionLaunch = output();
  windowLaunch = output<LaunchWindow>();

  open = signal(false);
  openId = signal(0);

  constructor(
    private service: VideoApiService,
    private shared: SharedStateService,
    private modal: ModalEventService,
    private utils: SharedUtils,
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.searchParam.set(params['searchParam']);
    });
  }

  setOpenId(value: number) {
    this.openId.set(value);
  }

  setOpen(value: boolean) {
    this.open.set(value);
  }

  async openInfo(info: LaunchWindow) {
    const menu = this.utils.getMenuItems(info.video);
    const answer = await this.modal.alert(info.video.title, 'Video Info', info.video.image!, menu);
    if (answer.key) {
      this.utils.handleItemClick({
        ...info,
        key: answer.key,
      });
    }
  }

  toggleFavorite(window: LaunchWindow) {
    this.openInfo(window);
    // this.service.toggleVideoFavorite(window.video.ID).subscribe(() => {
    //   this.shared.refreshVideo();
    // });
  }

  openMenu() {
    this.menuClick.emit();
  }

  launchSession() {
    this.sessionLaunch.emit();
  }

  launchWindow(window: LaunchWindow) {
    this.windowLaunch.emit(window);
  }

  getParam() {
    return;
  }
}
