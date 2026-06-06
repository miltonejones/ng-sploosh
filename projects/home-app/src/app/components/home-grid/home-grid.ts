import { Component, input, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { LaunchInfo, TrackCard, TrackInfo } from 'shared-utils';

export interface GridLaunchInfo {
  launchInfo: LaunchInfo;
  video: TrackInfo;
}
@Component({
  selector: 'app-home-grid',
  imports: [TrackCard],
  templateUrl: './home-grid.html',
  styleUrl: './home-grid.css',
})
export class HomeGrid implements OnInit, OnChanges {
  label = input('');
  videos = input<TrackInfo[]>([]);
  first = signal<TrackInfo[]>([]);
  remaining = signal<TrackInfo[]>([]);
  expanded = signal(false);
  modelSelect = output<number>();
  videoSelect = output<GridLaunchInfo>();
  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    this.first.set(this.videos().slice(0, 5));
    this.remaining.set(this.videos().slice(5));
  }

  expand() {
    this.expanded.set(!this.expanded());
  }

  selectModelById(id: number) {
    this.modelSelect.emit(id);
  }

  openVideo(launchInfo: LaunchInfo, video: TrackInfo) {
    this.videoSelect.emit({
      launchInfo,
      video,
    });
  }
}
