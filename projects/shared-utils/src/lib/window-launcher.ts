import { computed, Injectable } from '@angular/core';
import { TrackInfo, TrackResponse, WindowRegion } from './models';
import { RecentViewsService } from './recent-views.service';
import { DynamoStorageService } from './dynamo-storage.service';
import { WindowRegionConfigService } from './window-region';
import { VideoApiService } from './video-service';

interface LaunchWindow {
  window: Window | null;
  video: TrackInfo;
  index: number;
}
export const LAUNCH_COOKIE_NAME = 'prev-launcher-config';

@Injectable({ providedIn: 'root' })
export class WindowLauncherService {
  public launched: LaunchWindow[] = [];
  private memory: LaunchWindow[] = [];
  private cookieName = 'window-launcher';

  public lastLaunch = computed<LaunchWindow[]>(() => {
    const past = localStorage.getItem(LAUNCH_COOKIE_NAME);
    if (!past) return [];
    return JSON.parse(past);
  });

  constructor(
    private recent: RecentViewsService,
    private store: DynamoStorageService,
    private regionConfig: WindowRegionConfigService,
    private videoSvc: VideoApiService,
  ) {}

  get lastLaunched(): LaunchWindow[] {
    return this.lastLaunch();
  }

  async getSavedLaunches(): Promise<LaunchWindow[]> {
    const past = await this.read(); // this.store.getItemAsync(LAUNCH_COOKIE_NAME);
    if (!past) return [];
    return JSON.parse(past);
  }

  async updateLaunches() {
    const launches = await this.getSavedLaunches();
    const videoIds = launches.map((item) => item.video.ID.toString());
    const films = await new Promise((resolve) =>
      this.videoSvc.getVideoKeys(videoIds).subscribe(resolve),
    );
    const updated = launches.map((launch) => {
      const video = (films as TrackResponse).records.find((f) => f.ID === launch.video.ID);
      if (!video) return launch;
      return {
        ...launch,
        video,
      };
    });

    console.log({ films, updated });

    await this.saveLaunches(updated);
  }

  async read() {
    return localStorage.getItem(LAUNCH_COOKIE_NAME); //await this.store.getItemAsync(LAUNCH_COOKIE_NAME);
  }

  async write(value: string) {
    localStorage.setItem(LAUNCH_COOKIE_NAME, value);
    // await this.store.setItemAsync(LAUNCH_COOKIE_NAME, value);
  }

  async saveLaunches(launches: LaunchWindow[]): Promise<void> {
    await this.write(JSON.stringify(launches));
  }

  async launchWindow(info: LaunchWindow): Promise<void> {
    const region = this.regionConfig.getRegion(info.index);
    await this.open(info.video, region, info.index);
  }

  async launchAllSaved(): Promise<void> {
    const launches = await this.getSavedLaunches();
    for (const launch of launches) {
      const region = this.regionConfig.getRegion(launch.index);
      await this.open(launch.video, region, launch.index);
    }
  }

  async open(video: TrackInfo, region: WindowRegion, index: number): Promise<Window> {
    const address = this.buildAddress(video, region);
    const popup = window.open(
      address,
      `region_${index}`, // Unique window name per region slot
      `width=${region.width},` + // Window width in pixels
        `height=${region.height},` + // Window height in pixels
        `toolbar=0,location=0,` + // Hide browser chrome
        `left=${region.x},top=${region.y}`, // Position on screen (top-left corner)
    );

    const stored = await this.getSavedLaunches();

    console.log({ before: this.launched });
    const launcher: LaunchWindow = { window: popup, video, index };

    const launched = this.launched.filter((f) => f.index !== index);
    console.log({ launched });
    launched.push(launcher);
    this.memory.push(launcher);
    const savedWindows = [
      ...stored.filter((f) => f.index !== index),
      {
        window: null,
        video: launcher.video,
        index: launcher.index,
      },
    ];

    console.log({ savedWindows });
    await this.saveLaunches(savedWindows);

    // Focus the new window so it appears on top
    popup?.focus();
    this.launched = Array.from(launched); //.push({ window: popup, video, index });
    this.launched = launched;

    console.log({ after: this.launched });
    this.recent.addRecent(video.ID);
    return popup!;
  }

  focusAll(): void {
    this.launched.forEach((app) => app.window?.focus());
  }

  closeAll(): void {
    this.launched.forEach((app) => app.window?.close());
    this.launched = [];
  }

  isVisited(video: TrackInfo): boolean {
    return this.memory.some((l) => l.video.ID === video.ID);
  }

  get count(): number {
    return this.launched.length;
  }

  private buildAddress(video: TrackInfo, region: WindowRegion): string {
    if (video.src?.includes('javdoe.to')) {
      return `${video.src}#${region.width}/${region.height}`;
    }
    return this.quickSize(region, video.src);
  }

  private quickSize(region: WindowRegion, src: string): string {
    const regex = /embed\/(\d+)\/(\d+)\/(\d+)\/(\d+)/;
    return src.replace(regex, `embed/${region.width}/${region.height}`);
  }
}
