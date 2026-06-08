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
  GlobalWindowLauncherService,
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
  searchParams: SearchTab[] = [];

  responsePage = signal<TrackResponse>({ count: 0, records: [] });

  //launcher = new GlobalWindowLauncherService();

  private videoSvc = inject(VideoApiService);
  private sharedSvc = inject(SharedStateService);
  private pageSvc = inject(PaginationService);
  private route = inject(ActivatedRoute);
  // launcher = inject(WindowLauncherService);
  launched = signal<LaunchWindow[]>([]);
  private regionSvc = inject(WindowRegionConfigService);
  private tabSvc = inject(TabPersistService);
  private searchSvc = inject(SearchPersist);
  private router = inject(Router);
  private recent = inject(RecentViewsService);
  private modal = inject(ModalEventService);
  progress = signal(0);

  pageNum = signal(1);
  searchParam = signal('');
  domainParam = signal('');
  visiblePages = signal<number[]>([]);
  pageLinks = signal<PageLink[]>([]);
  count = computed(() => this.responsePage().count);

  get launcher(): GlobalWindowLauncherService {
    return window.launcher;
  }

  ngOnInit(): void {
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

    this.searchParams = this.tabSvc.getTabs();
  }

  isVisited(video: TrackInfo): boolean {
    if (!this.launcher) return false;
    return this.launcher.isVisited(video); //this.launcher.launched.some((l) => l.video.ID === video.ID);
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

  dropSearch(url: string) {
    this.tabSvc.removeTab(url);
    this.searchParams = this.tabSvc.getTabs();
    if (url !== this.searchParam()) return;
    this.router.navigate(['/videos/1']);
  }

  saveSearch() {
    this.searchSvc.addSearchTerm(this.searchParam());
  }

  getPage(page: number = 1) {
    if (this.router.url.indexOf('recent/') > 0) {
      this.openRecentPage();
    }
    if (this.router.url.indexOf('favorites') > 0) {
      this.videoSvc.getFavorites(this.pageNum()).subscribe((message) => {
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
    this.videoSvc.getVideos(this.pageNum()).subscribe((message) => {
      this.setMessage(message);
    });
  }

  openRecentPage() {
    const views = this.recent.getRecent();
    const start = 30 * (this.pageNum() - 1);
    const videoIds = views.slice(start, start + 30);
    this.videoSvc.getVideoKeys(videoIds.map((d) => d.toString())).subscribe((res) => {
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

  openDomainPage() {
    this.tabSvc.applyTab(this.domainParam(), 'domain');
    this.searchParams = this.tabSvc.getTabs();
    this.videoSvc.getVideosByDomain(this.domainParam(), this.pageNum()).subscribe((message) => {
      this.setMessage(message);
    });
    // this.sharedSvc.setSearch(this.domainParam());
  }

  openSearchPage() {
    this.tabSvc.applyTab(this.searchParam());
    this.searchParams = this.tabSvc.getTabs();
    this.videoSvc
      .findVideos(this.searchParam(), this.pageNum(), this.domainParam())
      .subscribe((message) => {
        this.setMessage(message);
      });
    this.sharedSvc.setSearch(this.searchParam());
  }

  async handleItemClick(info: MenuInfo) {
    // alert(info.key);
    switch (info.key) {
      case 'studio':
        this.router.navigate(['/find', info.studio! + '-', 1]);
        break;
      case 'google':
        window.open(`https://www.google.com/search?q=${info.video.Key}`);
        break;
      case 'info':
        await this.modal.alert(info.video.title, 'Video Info', info.video.image!);
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
          this.getPage();
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

  openVideo(launchInfo: LaunchInfo) {
    console.log({ launchInfo });
    const pane = this.regionSvc.REGIONS[launchInfo.index];
    const video = this.responsePage().records.find((f) => f.URL === launchInfo.url);
    if (!video) return;
    this.launcher.open(video, pane, launchInfo.index);
    this.launched.set(this.launcher.launched);
    this.launcher.focusAll();

    console.log({ launched: this.launcher.launched });
  }

  handleAddVideo() {
    // const uri = prompt('enter url');
    // if (!uri) return;
    // this.sharedSvc.addVideo(uri);
  }
}

declare global {
  interface Window {
    launcher: GlobalWindowLauncherService;
  }
}
