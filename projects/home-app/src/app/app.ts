import { AfterContentInit, Component, inject, OnInit, signal } from '@angular/core';
import {
  VideoApiService,
  DashModel,
  SharedStateService,
  TrackInfo,
  LaunchInfo,
  MenuInfo,
  TrackCard,
  recentViews,
  TrackResponse,
  WindowRegionConfigService,
  WindowLauncherService,
} from 'shared-utils';
import { ModelCard } from './components/model-card/model-card';
import { GridLaunchInfo, HomeGrid } from './components/home-grid/home-grid';

@Component({
  selector: 'app-root',
  imports: [ModelCard, HomeGrid],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterContentInit {
  protected readonly title = signal('home-app');
  private videoSvc = inject(VideoApiService);
  private sharedSvc = inject(SharedStateService);
  private regionSvc = inject(WindowRegionConfigService);
  private launcher = inject(WindowLauncherService);
  models = signal<DashModel[]>([]);
  remaining = signal<DashModel[]>([]);
  expanded = signal({
    models: false,
    faves: false,
    latest: false,
    recent: false,
  });
  expandedFave = signal(false);

  favorites = signal<TrackInfo[]>([]);
  firstFavorites = signal<TrackInfo[]>([]);
  remainingFavorites = signal<TrackInfo[]>([]);

  latest = signal<TrackInfo[]>([]);
  firstLatest = signal<TrackInfo[]>([]);
  remainingLatest = signal<TrackInfo[]>([]);

  recents = signal<TrackInfo[]>([]);
  firstRecent = signal<TrackInfo[]>([]);
  remainingRecent = signal<TrackInfo[]>([]);

  constructor() {}

  ngAfterContentInit(): void {
    this.init();
    this.getFavorites();
    this.sharedSvc.videoRefresh.subscribe(() => {
      this.init();
    });
  }

  expand(key: 'models' | 'faves' | 'latest' | 'recent') {
    this.expanded.update((f) => ({
      ...f,
      [key]: !this.expanded()[key],
    }));
  }

  init() {
    // this.models.set([]);
    // this.remaining.set([]);
    this.videoSvc.getDash().subscribe((response) => {
      const sorted = response.sort((a, b) => (a.FaveCount > b.FaveCount ? -1 : 1));
      this.models.set(sorted.slice(0, 6));
      this.remaining.set(sorted.slice(6));
    });
  }

  getFavorites() {
    this.videoSvc.getFavorites(1).subscribe((message) => {
      this.favorites.set(message.records);
      this.firstFavorites.set(message.records.slice(0, 5));
      this.remainingFavorites.set(message.records.slice(5));
      this.getLatest();
    });
  }

  getLatest() {
    this.videoSvc.getVideos(1).subscribe((message) => {
      this.latest.set(message.records);
      this.firstLatest.set(message.records.slice(0, 5));
      this.remainingLatest.set(message.records.slice(5));
      this.getRecent();
    });
  }

  getRecent() {
    const start = 0;
    const videoIds = recentViews.slice(start, start + 30);
    this.videoSvc.getVideoKeys(videoIds.map((d) => d.toString())).subscribe((res) => {
      const message: TrackResponse = {
        count: recentViews.length,
        records: (res as TrackResponse).records,
      };
      this.recents.set(message.records);
      this.firstRecent.set(message.records.slice(0, 5));
      this.remainingRecent.set(message.records.slice(5));
    });
  }

  selectModel(model: DashModel) {
    this.sharedSvc.selectModel(model.ID);
  }

  selectModelById(id: number) {
    this.sharedSvc.selectModel(id);
  }

  launchVideo(info: GridLaunchInfo) {
    this.openVideo(info.launchInfo, info.video);
  }

  openVideo(launchInfo: LaunchInfo, video: TrackInfo) {
    const pane = this.regionSvc.REGIONS[launchInfo.index];
    // const video = this.responsePage().records.find((f) => f.URL === launchInfo.url);
    if (!video) return;
    this.launcher.open(video, pane, launchInfo.index);
  }
}
