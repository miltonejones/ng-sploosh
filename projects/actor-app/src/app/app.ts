import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  ActorResponse,
  PageLink,
  PaginationService,
  SharedStateService,
  VideoApiService,
  Paginator,
  WindowLauncherService,
  WindowRegionConfigService,
  ModelAvatar,
  ActorInfo,
  ImageFix,
  TrackInfo,
  ModalEventService,
  ModelCard,
  ModalResponse,
  DashModel,
  ModelInfo,
  ModelItem,
  LaunchWindow,
  SnackBar,
} from 'shared-utils';
import {
  ActorVideoCard,
  LaunchInfo,
  MenuInfo,
} from './components/actor-video-card/actor-video-card';
import { MenuItemService } from './services/menu-item.service';
export interface SearchOptions {
  page?: number;
  favorite?: boolean;
  param?: string;
  domain?: string;
}

type viewType = 'grid' | 'costar' | 'missing' | 'favorite';

interface MenuItem {
  label: string;
  key: viewType;
}
@Component({
  selector: 'app-root',
  imports: [
    ActorVideoCard,
    ModelItem,
    Paginator,
    ModelCard,
    ModelAvatar,
    ImageFix,
    CommonModule,
    FormsModule,
    SnackBar,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  //
  protected readonly title = signal('actor-app');
  searchModalContainer: bootstrap.Modal | undefined = undefined;
  actor = signal<ActorResponse>({
    videos: {
      count: 0,
      records: [],
    },
    domains: [],
    aliases: [],
    model: [],
  });
  star: ActorInfo | null = null;
  pageLinks = signal<PageLink[]>([]);
  starLinks = signal<PageLink[]>([]);
  missingLinks = signal<PageLink[]>([]);
  pageNum = signal(1);
  imageError = false;
  stars: ActorInfo[] = [];
  missing = signal<TrackInfo[]>([]);
  domainParam = '';
  favoriteParam = false;
  paramParam = '';
  costars = signal<ActorInfo[]>([]);
  costarPage = signal<ActorInfo[]>([]);
  missingPage = signal<TrackInfo[]>([]);
  viewName: viewType = 'grid';
  aliasView = signal(false);
  aliases = signal<ModelInfo[]>([]);
  multipleURLs = signal<string[]>([]);
  multipleCount = signal<number>(0);
  progress = signal(0);

  count = computed(() => this.actor().videos.count);
  tabs = signal<MenuItem[]>([]);
  selectedVideos = signal<TrackInfo[]>([]);
  doomedVideos = signal<TrackInfo[]>([]);
  launched = signal<LaunchWindow[]>([]);

  setImageError() {
    this.imageError = true;
  }

  setView(name: viewType) {
    this.pageNum.set(1);
    if (name === 'favorite') {
      this.toggleFavorite(true);
      return;
    }
    if (name === 'grid') {
      this.toggleFavorite(false);
      return;
    }
    this.viewName = name;
    // const favoriteParam = !this.favoriteParam;
    // if (name === 'favorite') {
    //   this.getCurrentModel();
    // }
    // this.favoriteParam = favoriteParam;
  }

  constructor(
    public sharedState: SharedStateService,
    public videoSvc: VideoApiService,
    public pageSvc: PaginationService,
    public launcher: WindowLauncherService,
    public regionSvc: WindowRegionConfigService,
    private modal: ModalEventService,
    private utils: MenuItemService,
  ) {}

  setAlias() {
    this.aliasView.set(!this.aliasView());
    this.aliases.set([]);
  }

  selectedVideosChange(video: TrackInfo) {
    const selected = this.selectedVideos();
    const idx = selected.findIndex((f) => f.ID === video.ID);
    if (idx === -1) {
      this.selectedVideos.set([...selected, video]);
    } else {
      selected.splice(idx, 1);
      this.selectedVideos.set([...selected]);
    }
  }

  dropCroppedVideos() {
    const doomed = this.doomedVideos();
    if (!doomed.length) {
      this.pageNum.set(1);
      this.refreshState();
      return;
    }
    const video = doomed.pop();
    this.videoSvc.deleteVideo(video!.ID).subscribe(() => {
      this.doomedVideos.set(doomed);
      this.dropCroppedVideos();
    });
  }

  getCroppedVideos(pg: number) {
    this.videoSvc
      .getModel(this.star?.ID!, {
        page: pg,
      })
      .subscribe((res) => {
        if (!res.videos.records.length) return;
        this.doomedVideos.update((f) => [...f, ...res.videos.records]);
        this.getCroppedVideos(pg + 1);
      });
  }

  cancelCrop() {
    this.doomedVideos.set([]);
  }

  cropVideos() {
    this.doomedVideos.set([]);
    this.getCroppedVideos(this.pageNum());
  }

  isSelected(video: TrackInfo): boolean {
    return !!this.selectedVideos().find((f) => f.ID === video.ID);
  }

  refreshState() {
    this.sharedState.refreshVideo();
  }

  isVisited(video: TrackInfo): boolean {
    return this.launcher.isVisited(video);
  }

  createAsDash(actor: ActorInfo): DashModel {
    return {
      ID: actor.ID,
      image: actor.image,
      name: actor.name,
      FaveCount: 0,
      videoCount: 0,
    };
  }

  async handleItemClick(info: MenuInfo) {
    switch (info.key) {
      case 'select':
        this.selectedVideosChange(info.video);
        break;
      case 'photo':
        this.videoSvc.updateModelPhoto(this.star?.ID!, info.video.image!).subscribe(() => {
          this.refreshState();
        });
        break;
      case 'info':
        const menu = this.utils.getMenuItems(info.video);
        const answer = await this.modal.alert(
          info.video.title,
          'Video Info',
          info.video.image!,
          menu,
        );

        if (answer.key) {
          this.handleItemClick({
            ...info,
            key: answer.key,
          });
          break;
        }
        break;
      case 'google':
        window.open(`https://www.google.com/search?q=${info.video.Key}`);
        break;
      case 'jav':
        if (!info.video.Key) {
          break;
        }
        window.open(`https://www.javlibrary.com/en/vl_searchbyid.php?keyword=${info.video.Key}`);
        break;
      case 'drop':
        const ok = await this.modal.confirm(`Are you sure you want to delete ${info.video.title}`);
        if (!ok.ok) break;
        this.videoSvc.deleteVideo(info.video.ID).subscribe(() => {
          this.refreshState();
        });
        break;
      case 'decast':
        const accept = await this.modal.confirm(
          `Are you sure you want to remove ${this.star?.name} from this video?`,
        );
        if (!accept.ok) break;
        this.videoSvc.removeModelFromVideo(info.video.ID, this.star?.ID!).subscribe(() => {
          this.refreshState();
        });
        break;
      case 'open':
        window.open(info.video.URL);
        break;
      case 'fave':
        this.videoSvc.toggleVideoFavorite(info.video.ID).subscribe(() => {
          this.refreshState();
        });
        break;
      default:
      // do nothing
    }
  }

  showSearchModal() {
    this.pageNum.set(1);
    this.show();
  }

  hide() {
    this.searchModalContainer && this.searchModalContainer.hide();
  }

  show() {
    this.searchModalContainer = new bootstrap.Modal(document.getElementById('modelModal'));
    this.searchModalContainer.show();
  }

  openVideo(launchInfo: LaunchInfo) {
    const pane = this.regionSvc.REGIONS[launchInfo.index];
    const video = this.actor()?.videos.records.find((f) => f.URL === launchInfo.url);
    if (!video) return;
    this.launcher.open(video, pane, launchInfo.index);
  }

  displayModel(id: number) {
    this.pageNum.set(1);
    this.getModelPage(id);
    this.showSearchModal();
  }

  ngOnInit(): void {
    this.sharedState.modelSelect.subscribe((id) => {
      this.displayModel(id);
    });

    window.addEventListener('displayModel', (e: Event) => {
      // debugger;
      const customEvent = e as CustomEvent;
      this.displayModel(customEvent.detail.ID);
    });

    // alert('Actor App Loaded!');
    this.sharedState.videoRefresh.subscribe(() => {
      this.getModelPage(this.star!.ID);
    });

    this.sharedState.importComplete.subscribe(() => {
      this.addNextVideo();
    });

    this.sharedState.progress.subscribe((num) => {
      this.progress.set(num);
    });

    this.updateLaunched();
  }

  getModel(param: any) {
    // alert(JSON.stringify(param));
    this.getModelbyID(param.ID);
  }

  getModelbyID(id: number) {
    this.pageNum.set(1);
    this.getModelPage(id);
  }

  handleModelClick(actor: ActorInfo) {
    this.getModelbyID(actor.ID);
  }

  recastModels() {
    const selected = this.selectedVideos();
    if (!selected.length) {
      this.setView('grid');
      this.refreshState();
      return;
    }
    const video = selected.pop();
    this.videoSvc.addModelToVideo(video!.ID, this.star?.ID!).subscribe(() => {
      this.selectedVideos.set(selected);
      this.recastModels();
    });
  }

  dedupeModel(videoId: number) {
    this.videoSvc.removeModelFromVideo(videoId, this.star?.ID!).subscribe(() => {
      this.videoSvc.addModelToVideo(videoId, this.star?.ID!).subscribe(() => {
        this.refreshState();
      });
    });
  }

  clearParam() {
    this.paramParam = '';
    this.getCurrentModel();
  }

  toggleFavorite(value: boolean) {
    this.favoriteParam = value;
    this.getCurrentModel();
  }

  setFavorite() {
    this.favoriteParam = !this.favoriteParam;
    this.getCurrentModel();
  }

  getCurrentModel() {
    if (this.aliasView()) return;
    this.getModelPage(this.actor()!.model![0].ID);
  }

  modelSearch() {
    if (this.paramParam.length < 3) return;
    this.videoSvc.getModelsByName(this.paramParam).subscribe((stars) => {
      this.aliases.set(stars);
    });
  }

  addModelAlias(alias: ModelInfo) {
    this.videoSvc.addModelAlias(this.star?.ID!, alias.ID).subscribe(() => {
      this.paramParam = '';
      this.setAlias();
      this.refreshState();
    });
  }

  getModelPage(id: number) {
    this.viewName = this.favoriteParam ? 'favorite' : 'grid';
    const options = {
      page: this.pageNum(),
      domain: this.domainParam,
      param: this.paramParam,
      favorite: this.favoriteParam,
    };
    this.videoSvc.getModel(id, options).subscribe((response) => {
      this.actor.set(response);
      this.star = response.model[0];
      const stars = this.stars.filter((f) => f.ID !== this.star?.ID);
      stars.push(this.star);
      this.stars = stars;
      this.tabs.set([
        {
          label: 'Videos',
          key: 'grid',
        },
        {
          label: 'Favorites',
          key: 'favorite',
        },
      ]);
      const c = this.pageSvc.getPageLinks(this.pageNum(), 16, response.videos.count);
      this.getCostars(this.star.ID);

      this.updateLaunched();
      if (response.videos.count <= 16) return this.pageLinks.set([]);
      this.pageLinks.set(c);
    });
  }

  getCostars(id: number) {
    // debugger;
    this.videoSvc.getModelCostars(id).subscribe((res) => {
      this.costars.set(res);
      this.getCostarPage();

      if (this.costars().length) {
        this.tabs.update((f) => [
          ...f,
          {
            label: `Costars (${this.costars().length})`,
            key: 'costar',
          },
        ]);
      }
    });
  }

  getCostarPage(pg?: number) {
    const page = pg || 1;
    const c = this.pageSvc.getPageLinks(page, 15, this.costars().length);
    const start = (page - 1) * 15;
    this.costarPage.set(this.costars().slice(start, start + 15));
    console.log({ c });
    !!pg && this.pageNum.set(page);
    this.starLinks.set(c);
    this.getMissing();
  }

  getMissing() {
    // debugger;
    this.videoSvc.getModelMissingVideos(this.star?.ID!).subscribe((res) => {
      this.missing.set(res);
      console.log({ missing: res });
      this.getMissingPage();
      // debugger;
      if (this.missing().length) {
        this.tabs.update((f) => [
          ...f,
          {
            label: `(${this.missing().length}) missing videos`,
            key: 'missing',
          },
        ]);
      }
    });
  }

  getMissingPage(pg?: number) {
    const page = pg || 1;
    const c = this.pageSvc.getPageLinks(page, 16, this.missing().length);
    const start = (page - 1) * 15;
    this.missingPage.set(this.missing().slice(start, start + 15));
    !!pg && this.pageNum.set(page);
    console.log({ c });
    this.missingLinks.set(c);
  }

  setPage(page: number) {
    this.pageNum.set(page);
    this.getModelPage(this.actor()!.model![0].ID);
  }

  addNextVideo() {
    const addresses = this.multipleURLs();
    const progress = 100 - Math.floor(100 * (addresses.length / this.multipleCount()));
    this.sharedState.setProgress(progress);
    const address = addresses.pop();
    if (!address) {
      this.sharedState.setProgress(0);
      this.multipleCount.set(0);
      // this.modal.alert('All videos added!', 'Success!');
      return;
    }
    this.multipleURLs.set(addresses);
    this.sharedState.addVideo({
      uri: address,
      modelFk: this.star?.ID!,
    });
  }

  handleResponse(res: ModalResponse) {
    const uri = res.message;

    if (res.messages?.length) {
      this.multipleCount.set(res.messages.length);
      this.multipleURLs.set(res.messages);
      this.addNextVideo();
      return;
    }

    if (!uri) return;
    this.sharedState.addVideo({
      uri,
      modelFk: this.star?.ID!,
    });
    this.show();
  }

  async handleAddVideo() {
    const res = await this.modal.prompt('Enter video URL', 'Add video starring ' + this.star?.name);
    this.handleResponse(res);
  }

  async updateLaunched() {
    const launched = await this.launcher.getSavedLaunches();
    this.launched.set(launched);
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
