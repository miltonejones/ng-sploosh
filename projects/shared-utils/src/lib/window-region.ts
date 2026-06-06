// services/window-region-config.service.ts
// Single responsibility: Define and provide window regions
import { Injectable } from '@angular/core';
import { WindowRegion } from './models';
// import { WindowRegion } from '../models/video.model';

@Injectable({ providedIn: 'root' })
export class WindowRegionConfigService {
  private readonly BASE_WIDTH = 1920;

  readonly REGIONS: WindowRegion[] = [
    { width: 960, height: 538, x: 0, y: 0 },
    { width: 960, height: 538, x: 960, y: 0 },
    { width: 640, height: 360, x: 0, y: 600 },
    { width: 640, height: 360, x: 640, y: 600 },
    { width: 640, height: 360, x: 1280, y: 600 },
  ];

  getScaleFactor(targetWidth: number): number {
    return targetWidth / this.BASE_WIDTH;
  }

  getScaledRegions(targetWidth: number, targetHeight: number): WindowRegion[] {
    const ratio = this.getScaleFactor(targetWidth);
    return this.REGIONS.map((region) => ({
      ...region,
      width: region.width * ratio,
      height: region.height * ratio,
      x: region.x * ratio,
      y: region.y * ratio,
    }));
  }

  getRegion(index: number): WindowRegion {
    return this.REGIONS[index % this.REGIONS.length];
  }
}
