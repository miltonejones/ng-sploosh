import {
  Component,
  computed,
  inject,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  ModelInfo,
  VideoApiService,
  sampleTrack,
  TrackInfo,
  TrackResponse,
  PaginationService,
  PageLink,
  WindowLauncherService,
  WindowRegionConfigService,
  Paginator,
  ModalBox,
  ModalEventService,
  recentViews,
  LaunchInfo,
  MenuInfo,
  TrackCard,
  TabPersistService,
  SearchPersist,
  LaunchWindow,
  RecentViewsService,
  SharedUtils,
} from 'shared-utils';
import { SharedStateService } from 'shared-utils';

export interface SearchTab {
  param: string;
  type: string;
}

@Component({
  selector: 'app-root',
  imports: [TrackCard, Paginator],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnChanges {
  protected readonly title = signal('app-workspace');
  trackInfo: TrackInfo = sampleTrack;
  modelInfo: ModelInfo = sampleTrack.models[0];
  searchParams = signal<SearchTab[]>([]);

  responsePage = signal<TrackResponse>({ count: 0, records: [] });

  private videoSvc = inject(VideoApiService);
  private sharedSvc = inject(SharedStateService);
  private pageSvc = inject(PaginationService);
  private route = inject(ActivatedRoute);
  launcher = inject(WindowLauncherService);
  launched = signal<LaunchWindow[]>([]);
  private regionSvc = inject(WindowRegionConfigService);
  private tabSvc = inject(TabPersistService);
  private searchSvc = inject(SearchPersist);
  private router = inject(Router);
  private recent = inject(RecentViewsService);
  private modal = inject(ModalEventService);
  private utils = inject(SharedUtils);
  progress = signal(0);

  pageNum = signal(1);
  searchParam = signal('');
  domainParam = signal('');
  visiblePages = signal<number[]>([]);
  pageLinks = signal<PageLink[]>([]);
  count = computed(() => this.responsePage().count);
  selectedParams = signal<Record<string, boolean>>({});
  busy = signal(false);

  setBusy(value: boolean) {
    this.busy.set(value);
    this.progress.set(value ? 100 : 0);
  }

  get searchTerm() {
    if (!this.searchParam()) return '';
    return this.searchParam().replace('*', '');
  }

  toggleParam(tab: SearchTab) {
    const current = this.selectedParams();
    this.selectedParams.set({ ...current, [tab.param]: !current[tab.param] });
  }

  async dropSearches() {
    const keys = Object.keys(this.selectedParams()).filter((k) => this.selectedParams()[k]);
    for (const key of keys) {
      await this.tabSvc.removeTab(key);
    }
    await this.updateTabs();
    if (keys.indexOf(this.searchParam()) < 0) return;
    this.router.navigate(['/videos/1']);
  }

  async ngOnInit() {
    this.route.params.subscribe((params) => {
      const page = params['pageNum'] ? Number(params['pageNum']) : 1;
      this.pageNum.set(page);
      this.searchParam.set(params['searchParam']);
      this.domainParam.set(params['domainParam']);
      this.getPage(page);
    });

    this.sharedSvc.progress.subscribe((num) => {
      this.progress.set(num);
    });

    this.sharedSvc.videoRefresh.subscribe(() => {
      this.getPage();
    });

    this.recent.recentUpdated.subscribe(() => {
      this.getPage();
    });

    await this.updateTabs();
    await this.updateLaunched();
  }

  isVisited(video: TrackInfo): boolean {
    if (!this.launcher) return false;
    return this.launcher.isVisited(video);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getPage();
  }

  setMessage(message: TrackResponse) {
    this.responsePage.set(message);
    const c = this.pageSvc.getPageLinks(this.pageNum(), 30, message.count);
    this.pageLinks.set(c);
  }

  navigate(tab: SearchTab) {
    if (tab.type === 'domain') {
      this.router.navigate([`/domain/${tab.param}/1`]);
      return;
    }
    this.router.navigate([`/find/${tab.param}/1`]);
  }

  get isFavorite(): boolean {
    return this.searchParam().indexOf('*') > 0;
  }

  toggleFavorite() {
    const freshParam = this.isFavorite
      ? this.searchParam().replace('*', '')
      : this.searchParam() + '*';
    this.router.navigate([`/find/${freshParam}/1`]);
  }

  async dropSearch(url: string) {
    await this.tabSvc.removeTab(url);
    await this.updateTabs();
    if (url !== this.searchParam()) return;
    this.router.navigate(['/videos/1']);
  }

  saveSearch() {
    this.searchSvc.addSearchTerm(this.searchParam());
  }

  observe(subscription: Observable<any>, fn: (res: any) => void) {
    this.setBusy(true);
    subscription.subscribe((res) => {
      this.setBusy(false);
      fn(res);
    });
  }

  getPage(page: number = 1) {
    if (this.router.url.indexOf('recent/') > 0) {
      this.openRecentPage();
      return;
    }
    if (this.router.url.indexOf('favorites') > 0) {
      this.observe(this.videoSvc.getFavorites(this.pageNum()), (message) => {
        this.setMessage(message);
      });
      return;
    }
    if (this.searchParam()) {
      this.openSearchPage();
      return;
    }
    if (this.domainParam()) {
      this.openDomainPage();
      return;
    }
    this.observe(this.videoSvc.getVideos(this.pageNum()), (message) => {
      this.setMessage(message);
    });
    // this.videoSvc.getVideos(this.pageNum()).subscribe((message) => {
    //   this.setMessage(message);
    // });
  }

  async openRecentPage() {
    const views = await this.recent.getRecentAsync();

    console.log({ views });
    const start = 30 * (this.pageNum() - 1);
    const videoIds = views.slice(start, start + 30);
    this.observe(this.videoSvc.getVideoKeys(videoIds.map((d) => d.toString())), (res) => {
      const records: TrackInfo[] = [];
      videoIds.forEach((id) => {
        const record = (res as TrackResponse).records.find((f) => f.ID === id);
        !!record && records.push(record);
      });
      const message: TrackResponse = {
        count: views.length,
        records,
      };
      console.log({ videoIds, views, message });
      this.setMessage(message);
    });
  }

  async openDomainPage() {
    this.tabSvc.applyTab(this.domainParam(), 'domain');
    await this.updateTabs();
    this.observe(this.videoSvc.getVideosByDomain(this.domainParam(), this.pageNum()), (message) => {
      this.setMessage(message);
    });
  }

  async updateTabs() {
    const searchParams = await this.tabSvc.getTabsAsync();
    this.searchParams.set(searchParams);
  }

  async openSearchPage() {
    await this.tabSvc.applyTab(this.searchParam());
    await this.updateTabs();
    this.observe(
      this.videoSvc.findVideos(this.searchParam(), this.pageNum(), this.domainParam()),
      (message) => {
        this.setMessage(message);
      },
    );
    this.sharedSvc.setSearch(this.searchParam());
  }

  async handleItemClick(info: MenuInfo) {
    // alert(1);
    await this.utils.handleItemClick(info);
  }

  async handleItemClick_ex(info: MenuInfo) {
    switch (info.key) {
      case 'studio':
        this.router.navigate(['/find', info.studio! + '-', 1]);
        break;
      case 'google':
        window.open(`https://www.google.com/search?q=${info.video.Key}`);
        break;
      case 'info':
        const menu = this.utils.getMenuItems(info.video);
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
          this.getPage();
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

  setPage(page: number) {
    if (this.router.url.indexOf('favorites') > 0) {
      this.router.navigate(['/favorites', page]);
      return;
    }
    if (this.searchParam()) {
      if (this.domainParam()) {
        this.router.navigate(['/domain', this.domainParam(), this.searchParam(), page]);
        return;
      }
      this.router.navigate(['/find', this.searchParam(), page]);
      return;
    }

    if (this.domainParam()) {
      this.router.navigate(['/domain', this.domainParam(), page]);
      return;
    }
    this.router.navigate(['/videos', page]);
  }

  selectModel(id: number) {
    this.sharedSvc.selectModel(id);
  }

  async openVideo(launchInfo: LaunchInfo) {
    console.log({ launchInfo });
    const pane = this.regionSvc.REGIONS[launchInfo.index];
    const video = this.responsePage().records.find((f) => f.URL === launchInfo.url);
    if (!video) return;
    await this.launcher.open(video, pane, launchInfo.index);
    this.launched.set(this.launcher.launched);
    this.launcher.focusAll();

    await this.updateLaunched();
  }

  async updateLaunched() {
    const launched = await this.launcher.getSavedLaunches();
    this.launched.set(launched);
  }

  handleAddVideo() {
    // const uri = prompt('enter url');
    // if (!uri) return;
    // this.sharedSvc.addVideo(uri);
  }
}
