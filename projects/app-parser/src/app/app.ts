import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface ResponseError {
  error: string;
}

import {
  SharedStateService,
  ParserService,
  TrackInfo,
  ImageSource,
  VideoApiService,
  TrackResponse,
  AddedVideoInfo,
  ModalEventService,
} from 'shared-utils';
import { ModelCard } from './components/model-card/model-card';

@Component({
  selector: 'app-root',
  imports: [ImageSource, ModelCard],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('app-parser');
  video = signal<TrackInfo | null>(null);
  status = signal('');

  constructor(
    public sharedSvc: SharedStateService,
    public parser: ParserService,
    public videoSvc: VideoApiService,
    private modal: ModalEventService,
  ) {}

  ngOnInit(): void {
    this.sharedSvc.videoAdded.subscribe((param: string | AddedVideoInfo) => {
      const uri: string = typeof param === 'string' ? param : param.uri;
      const id: number | null = typeof param === 'string' ? null : param.modelFk;

      this.status.set('Finding video...');
      this.parser.getVideoByURL(uri).subscribe({
        next: (video) => {
          this.videoResponse(video, id);
        },
        error: (err) => {
          this.videoError(err, uri);
        },
      });
    });
  }

  async videoResponse(video: TrackInfo, id: number | null) {
    if (!video) {
      this.status.set('No video found');
      await this.modal.alert('No video found');
      this.sharedSvc.completeImport(false);
      return;
    }
    this.video.set(video);
    this.addVideo(id);
  }

  async videoError(err: Error, url: string) {
    console.error('Parser error:', err);
    await this.modal.alert(`Failed to parse video URL "${url}" ${err.message}`);
    this.status.set('Failed to parse video URL');
    this.video.set(null);
    this.sharedSvc.completeImport(false);
  }

  async checkVideoError(modelFk: number | null, err: ResponseError) {
    if (!modelFk) {
      return;
    }
    const match = /([a-zA-Z]+-\d+)/.exec(err.error);
    // debugger;
    if (!match) return;

    const response: TrackResponse = await new Promise((resolve) => {
      this.videoSvc.findVideos(match[1], 1).subscribe((res) => {
        resolve(res);
      });
    });
    console.log('Video error details:', response);

    // alert(JSON.stringify(response));

    const candidate = response.records.find(
      (v: any) => !v.models.some((m: any) => m.ID === modelFk),
    );

    if (candidate) {
      const confirm = await this.modal.confirm(
        `Do you want to add this model to the existing video "${candidate.title}"?`,
        'Existing video',
        candidate.image!,
      );

      if (confirm.ok) {
        await new Promise((resolve) => {
          this.videoSvc.addModelToVideo(candidate.ID, modelFk!).subscribe(() => {
            resolve(true);
          });
        });
        this.sharedSvc.refreshVideo();
      }
    }
  }

  async processResponse(modelFk: number | null, res: number) {
    if (isNaN(res)) {
      const err: ResponseError = res as unknown as ResponseError;
      if (err.error) {
        await this.modal.alert(err.error, 'Existing video', this.video()?.image!);
        await this.checkVideoError(modelFk, err);
      }
      this.video.set(null);
      this.status.set('');
      this.sharedSvc.completeImport(false);
      return;
    }

    if (modelFk) {
      this.status.set('Adding model...');
      this.videoSvc.addModelToVideo(res, modelFk).subscribe(() => {
        this.checkVideo(res);
      });
      return;
    }
    this.checkVideo(res);
  }

  addVideo(modelFk: number | null) {
    this.status.set('Saving video...');
    this.videoSvc.saveVideo(this.video()!).subscribe({
      next: (res: any) => {
        this.processResponse(modelFk, res);
      },
      error: (err: any) => {
        this.videoError(err, this.video()?.URL!);
      },
    });
  }

  checkVideo(id: number) {
    this.status.set('Checking video details...');
    this.videoSvc.getVideo(id.toString()).subscribe((video: TrackResponse) => {
      this.video.set(video.records[0]);
      setTimeout(() => {
        this.video.set(null);
        this.status.set('');
        this.sharedSvc.refreshVideo();
        this.sharedSvc.completeImport(true);
      }, 1999);
    });
  }
}
