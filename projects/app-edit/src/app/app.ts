import { AfterViewInit, Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import {
  SharedStateService,
  TrackInfo,
  TrackResponse,
  VideoApiService,
  ImageSource,
  ModelItem,
  ModelInfo,
  ModalEventService,
  InsertResponse,
} from 'shared-utils';
import { ListOption, ModelFinder } from './components/model-finder/model-finder';
import { ModelDropdown } from './components/model-dropdown/model-dropdown';

@Component({
  selector: 'app-root',
  imports: [ImageSource, ModelItem, ModelFinder, ModelDropdown],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  @ViewChild('inputField') inputField!: ElementRef;
  protected readonly title = signal('app-edit');
  open = signal(false);
  video = signal<TrackInfo | null>(null);
  searchModalContainer: bootstrap.Modal | undefined = undefined;

  constructor(
    public sharedService: SharedStateService,
    public videoSvc: VideoApiService,
    public modal: ModalEventService,
  ) {}

  handleStar(star: ModelInfo) {
    this.videoSvc.addModelToVideo(this.video()?.ID!, star.ID).subscribe(() => {
      this.refresh(this.video()?.ID!);
      this.sharedService.refreshVideo();
    });
    this.searchModalContainer && this.searchModalContainer.hide();
  }

  async handleDrop(star: ModelInfo) {
    const ok = await this.modal.confirm(`Are you sure you want to remove ${star.Name}?`);
    if (!ok.ok) return;
    this.videoSvc.removeModelFromVideo(this.video()?.ID!, star.ID).subscribe(() => {
      this.refresh(this.video()?.ID!);
      this.sharedService.refreshVideo();
    });
  }

  async handleOption(option: ListOption) {
    switch (option.key) {
      case 'multi':
        this.handleMulti(option.data!);
        this.searchModalContainer && this.searchModalContainer.hide();
        break;
      case 'create':
        await this.handleCreateAsync(option.data!);
        this.searchModalContainer && this.searchModalContainer.hide();
        break;
      default:
      // do nothing
    }
  }

  async handleCreateAsync(names: string[]): Promise<void> {
    const [name] = names;
    const res = await new Promise<InsertResponse>((handler) =>
      this.videoSvc.addModel(name).subscribe(handler),
    );
    const id = res.insertId;
    const ok = await this.modal.confirm(`Add video image as model [${id}] image?`);
    if (ok.ok) {
      await new Promise((handler) =>
        this.videoSvc.updateModelPhoto(id, this.video()?.image!).subscribe(handler),
      );
    }
    await new Promise((handler) =>
      this.videoSvc.addModelToVideo(this.video()?.ID!, id).subscribe(handler),
    );
    this.refresh(this.video()?.ID!);
    this.sharedService.refreshVideo();
  }

  handleCreate(names: string[]) {
    const [name] = names;
    this.videoSvc.addModel(name).subscribe((res) => {
      const id = res.insertId;
      this.videoSvc.addModelToVideo(this.video()?.ID!, id).subscribe(() => {
        this.refresh(this.video()?.ID!);
        this.sharedService.refreshVideo();
      });
    });
  }

  handleMulti(names: string[]) {
    const name = names.pop();
    if (!name) {
      this.refresh(this.video()?.ID!);
      this.sharedService.refreshVideo();

      return;
    }

    this.videoSvc.getModelsByName(name).subscribe((response) => {
      const [star] = response;
      if (!star) return this.handleMulti(names);
      this.videoSvc.addModelToVideo(this.video()?.ID!, star.ID).subscribe(() => {
        this.handleMulti(names);
      });
    });
  }

  refresh(id: number, open: boolean = false) {
    this.videoSvc.getVideo(id.toString()).subscribe((video: TrackResponse) => {
      this.video.set(video.records[0]);
      this.open.set(open);
      if (this.inputField) {
        this.inputField.nativeElement.focus();
      }
    });
  }

  ngOnInit(): void {
    this.sharedService.videoSelect.subscribe((id) => {
      this.refresh(id, true);
    });
  }

  closeWindow() {
    this.open.set(false);
  }

  showSearchModal() {
    this.searchModalContainer = new bootstrap.Modal(document.getElementById('starFinderModal'));
    this.searchModalContainer.show();
  }
}

declare namespace bootstrap {
  class Modal {
    constructor(element: Element | null);
    show(): void;
    hide(): void;
  }
}

declare global {
  interface Window {
    searchModalContainer: bootstrap.Modal | undefined;
  }
}
