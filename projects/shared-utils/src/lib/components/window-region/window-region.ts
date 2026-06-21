import {
  Component,
  computed,
  effect,
  EventEmitter,
  input,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { LaunchWindow, WindowRegion } from '../../models';
import { WindowRegionConfigService } from '../../window-region';
// import { LaunchWindow } from '../../window-launcher';
import { ImageSource } from '../../directives/image-source';

@Component({
  selector: 'lib-window-region',
  imports: [ImageSource],
  templateUrl: './window-region.html',
  styleUrl: './window-region.css',
})
export class RegionMenuComponent implements OnInit {
  launched = input<LaunchWindow[]>([]);
  selectedIndex = input<number | null>(null);

  @Input() width = 220;
  @Input() height = 130;
  open = input(false);
  @Output() select = new EventEmitter<number>();

  scaledRegions: WindowRegion[] = [];

  // Reactively derived from launched() signal — updates automatically
  images = computed(() => this.launched().map((win) => win.video.image));

  // Also computed if you need per-index lookup in the template
  imageMap = computed<Map<number, string>>(() => {
    const map = new Map<number, string>();
    for (const win of this.launched()) {
      map.set(win.index, win.video.image ?? 'url(no-image)');
    }
    return map;
  });

  // getImageStyle(index: number) {
  //   const win: LaunchWindow | undefined = this.launched().find((f) => f.index === index);
  //   if (!win) return 'url(no-image)';
  //   return win.video.image;
  // }
  getImageStyle(index: number): string {
    return this.imageMap().get(index) ?? 'url(no-image)';
  }
  constructor(private configService: WindowRegionConfigService) {
    effect(() => {
      // Reactive side-effect: logs whenever launched() changes
      // console.log('launched changed:', { region: this.launched(), map: this.imageMap() });
    });
  }

  ngOnInit(): void {
    this.scaledRegions = this.configService.getScaledRegions(this.width, this.height);
    // console.log({ region: this.launched(), map: this.imageMap() });
  }
}

declare global {
  interface Window {
    launcedWindows: Set<LaunchWindow>;
  }
}
