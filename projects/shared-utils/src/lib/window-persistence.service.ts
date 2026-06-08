// models.ts (plain version)
export interface WindowRegion {
  width: number;
  height: number;
  x: number;
  y: number;
  on?: boolean;
  src?: string;
}

export interface TrackInfo {
  ID: number;
  title: string;
  src: string;
  image?: string | null;
  URL: string;
  domain: string;
  dateAdded: any;
  modelFk: number;
  width: number;
  height: number;
  favorite: any;
  models: ModelInfo[];
  studio: string;
  Key: string;
}

export interface ModelInfo {
  trackFk: number;
  ID: number;
  Name: string;
  name?: string;
  image?: string | null;
}

export interface LaunchWindow {
  window: Window | null;
  video: TrackInfo;
  index: number;
}

export const LAUNCH_COOKIE_NAME = 'prev-launcher-config';

// Simple event emitter interface (replaces Angular's Subject)
export interface EventEmitter<T> {
  next(value: T): void;
  subscribe(callback: (value: T) => void): () => void;
}

// Simple Subject implementation
export class SimpleSubject<T> implements EventEmitter<T> {
  private callbacks: ((value: T) => void)[] = [];

  next(value: T): void {
    this.callbacks.forEach((callback) => callback(value));
  }

  subscribe(callback: (value: T) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }
}

// Recent Views Service (plain version)
export class RecentViewsService {
  COOKIE_NAME = 'recent-views';
  recentUpdated = new SimpleSubject<boolean>();

  constructor(private recentViews: number[] = []) {}

  getRecent(): number[] {
    const persisted = localStorage.getItem(this.COOKIE_NAME);
    if (persisted) {
      return JSON.parse(persisted);
    }
    return this.recentViews;
  }

  addRecent(id: number): void {
    const existing = this.getRecent();
    const truncated = existing.filter((f) => f !== id);
    const views = [id, ...truncated];
    console.log({ views });
    localStorage.setItem(this.COOKIE_NAME, JSON.stringify(views));
    this.recentUpdated.next(true);
  }

  dropRecent(id: number): void {
    const existing = this.getRecent();
    const truncated = existing.filter((f) => f !== id);
    localStorage.setItem(this.COOKIE_NAME, JSON.stringify(truncated));
    this.recentUpdated.next(true);
  }
}

// Window Launcher Service (plain TypeScript class)
export class GlobalWindowLauncherService {
  public launched: LaunchWindow[] = [];
  private memory: LaunchWindow[] = [];
  private recentViewsService: RecentViewsService;

  constructor(recentViewsService?: RecentViewsService) {
    this.recentViewsService = recentViewsService || new RecentViewsService();
  }

  get lastLaunch(): LaunchWindow[] {
    const past = localStorage.getItem(LAUNCH_COOKIE_NAME);
    if (!past) return [];
    return JSON.parse(past);
  }

  get lastLaunched(): LaunchWindow[] {
    return this.lastLaunch;
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
    this.launched = launched;

    console.log({ after: this.launched });
    this.recentViewsService.addRecent(video.ID);

    // Save to localStorage
    this.saveToLocalStorage();
    this.focusAll();
    return popup!;
  }

  focusAll(): void {
    this.launched.forEach((app) => app.window?.focus());
  }

  closeAll(): void {
    this.launched.forEach((app) => app.window?.close());
    this.launched = [];
    this.saveToLocalStorage();
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

  private saveToLocalStorage(): void {
    const toSave = this.launched.map((l) => ({
      video: l.video,
      index: l.index,
    }));
    localStorage.setItem(LAUNCH_COOKIE_NAME, JSON.stringify(toSave));
  }

  // Method to restore previously launched windows from localStorage
  restoreFromLocalStorage(): LaunchWindow[] {
    const saved = this.lastLaunch;
    if (saved.length > 0) {
      console.log('Restoring previously launched windows:', saved);
      // Note: You can't restore actual Window objects, only metadata
      this.memory = [...saved];
    }
    return saved;
  }

  // Clean up stale window references (call this periodically)
  cleanupStaleWindows(): void {
    this.launched = this.launched.filter((l) => l.window && !l.window.closed);
    this.saveToLocalStorage();
  }
}
