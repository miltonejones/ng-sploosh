import { computed, Injectable } from '@angular/core';
import { TrackInfo, WindowRegion } from './models';
import { RecentViewsService } from './recent-views.service';

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

  public lastLaunch = computed<LaunchWindow[]>(() => {
    const past = localStorage.getItem(LAUNCH_COOKIE_NAME);
    if (!past) return [];
    return JSON.parse(past);
  });

  constructor(private recent: RecentViewsService) {}

  get lastLaunched(): LaunchWindow[] {
    return this.lastLaunch();
  }

  open(video: TrackInfo, region: WindowRegion, index: number): Window {
    const address = this.buildAddress(video, region);
    const popup = window.open(
      address,
      `region_${index}`, // Unique window name per region slot
      `width=${region.width},` + // Window width in pixels
        `height=${region.height},` + // Window height in pixels
        `toolbar=0,location=0,` + // Hide browser chrome
        `left=${region.x},top=${region.y}` // Position on screen (top-left corner)
    );

    console.log({ before: this.launched });
    const launcher: LaunchWindow = { window: popup, video, index };

    const launched = this.launched.filter((f) => f.index !== index);
    console.log({ launched });
    launched.push(launcher);
    this.memory.push(launcher);

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
