// region-menu.component.ts
import { Component, Input, Output, EventEmitter, OnInit, input } from '@angular/core';
import { WindowRegion, WindowRegionConfigService } from 'shared-utils';

@Component({
  selector: 'app-region-menu',
  templateUrl: `./window-region.html`,
  styleUrls: [`./window-region.css`],
})
export class RegionMenuComponent implements OnInit {
  @Input() width = 220;
  @Input() height = 130;
  open = input(false);
  @Output() select = new EventEmitter<number>();

  scaledRegions: WindowRegion[] = [];

  constructor(private configService: WindowRegionConfigService) {}

  ngOnInit(): void {
    this.scaledRegions = this.configService.getScaledRegions(this.width, this.height);
  }
}
