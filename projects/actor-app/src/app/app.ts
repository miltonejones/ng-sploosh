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
} from 'shared-utils';
import {
  ActorVideoCard,
  LaunchInfo,
  MenuInfo,
} from './components/actor-video-card/actor-video-card';
export interface SearchOptions {
  page?: number;
  favorite?: boolean;
  param?: string;
  domain?: string;
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
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
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
  pageNum = signal(1);
  imageError = false;
  stars: ActorInfo[] = [];
  domainParam = '';
  favoriteParam = false;
  paramParam = '';
  costars = signal<ActorInfo[]>([]);
  costarPage = signal<ActorInfo[]>([]);
  viewName: 'grid' | 'costar' = 'grid';
  aliasView = signal(false);
  aliases = signal<ModelInfo[]>([]);
  multipleURLs = signal<string[]>([]);
  multipleCount = signal<number>(0);
  progress = signal(0);

  count = computed(() => this.actor().videos.count);

  setImageError() {
    this.imageError = true;
  }

  setView(name: 'grid' | 'costar') {
    this.pageNum.set(1);
    this.viewName = name;
  }

  constructor(
    public sharedState: SharedStateService,
    public videoSvc: VideoApiService,
    public pageSvc: PaginationService,
    public launcher: WindowLauncherService,
    public regionSvc: WindowRegionConfigService,
    private modal: ModalEventService
  ) {}

  setAlias() {
    this.aliasView.set(!this.aliasView());
    this.aliases.set([]);
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
    };
  }

  async handleItemClick(info: MenuInfo) {
    switch (info.key) {
      case 'photo':
        this.videoSvc.updateModelPhoto(this.star?.ID!, info.video.image!).subscribe(() => {
          this.refreshState();
        });
        break;
      case 'info':
        await this.modal.alert(info.video.title, 'Video Info', info.video.image!);
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

  ngOnInit(): void {
    this.sharedState.modelSelect.subscribe((id) => {
      this.pageNum.set(1);
      this.getModelPage(id);
      this.showSearchModal();
    });

    this.sharedState.videoRefresh.subscribe(() => {
      this.getModelPage(this.star!.ID);
    });

    this.sharedState.importComplete.subscribe(() => {
      this.addNextVideo();
    });

    this.sharedState.progress.subscribe((num) => {
      this.progress.set(num);
    });
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
    this.viewName = 'grid';
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
      const c = this.pageSvc.getPageLinks(this.pageNum(), 16, response.videos.count);
      if (response.videos.count <= 16) return this.pageLinks.set([]);
      this.pageLinks.set(c);
      this.getCostars(this.star.ID);
    });
  }

  getCostars(id: number) {
    this.videoSvc.getModelCostars(id).subscribe((res) => {
      this.costars.set(res);
      this.getCostarPage();
    });
  }

  getCostarPage(pg?: number) {
    const page = pg || 1;
    const c = this.pageSvc.getPageLinks(this.pageNum(), 15, this.costars().length);
    const start = (page - 1) * 15;
    this.costarPage.set(this.costars().slice(start, start + 15));
    console.log({ c });
    !!pg && this.pageNum.set(page);
    this.starLinks.set(c);
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
