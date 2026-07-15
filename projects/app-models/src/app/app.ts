import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  VideoApiService,
  ModelResponse,
  DashModel,
  ModelCard,
  PageLink,
  PaginationService,
  Paginator,
  SharedStateService,
} from 'shared-utils';

type SortField = 'name' | 'videoCount' | 'faveCount';

interface ModelInfo {
  count: number;
  records: DashModel[];
}

@Component({
  selector: 'app-root',
  imports: [ModelCard, Paginator],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('app-models');
  page = signal(1);
  response = signal<ModelInfo>({
    count: 0,
    records: [],
  });
  param = signal('');
  sortField = signal<SortField>('name');
  sortDesc = signal(true);

  count = computed(() => this.response().count);
  pageLinks = signal<PageLink[]>([]);

  constructor(
    public videoApi: VideoApiService,
    public route: ActivatedRoute,
    public pageSvc: PaginationService,
    public router: Router,
    public sharedSvc: SharedStateService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const page = params['pageNum'] ? Number(params['pageNum']) : 1;
      this.page.set(page);
      this.param.set(params['searchParam'] || '');
      this.getPage(page);
    });

    this.sharedSvc.videoRefresh.subscribe(() => {
      this.getPage(this.page());
    });
  }

  getModel(model: DashModel) {
    this.sharedSvc.selectModel(model.ID);

    window.dispatchEvent(new CustomEvent('displayModel', { detail: { ID: model.ID } }));
  }

  setPage(pageNum: number) {
    if (this.param()) {
      this.router.navigate(['/models', this.param(), pageNum]);
      return;
    }
    this.router.navigate(['/models', pageNum]);
  }

  setSort(field: SortField) {
    if (this.sortField() === field) {
      this.sortDesc.update(d => !d);
    } else {
      this.sortField.set(field);
      this.sortDesc.set(true);
    }
    this.getPage(this.page());
  }

  setMessage(response: ModelResponse) {
    this.response.set({
      count: response.count,
      records: response.records.map((model: any) => ({
        ID: model.ID,
        name: model.name!,
        image: model.image || '',
        FaveCount: model.likedCount || 0,
        videoCount: model.VideoCount || model.videoCount || 0,
      })),
    });
    const c = this.pageSvc.getPageLinks(this.page(), 30, response.count);
    this.pageLinks.set(c);
  }

  getPage(pageNum: number) {
    this.setMessage({
      count: 0,
      records: [],
    });

    if (this.param()) {
      this.videoApi.getModelsByName(this.param()).subscribe((response: any) => {
        console.log('Find Videos Response:', response);

        const start = 30 * (this.page() - 1);
        const records = response.slice(start, start + 30);

        const transformed = {
          count: response.length,
          records,
        };
        this.setMessage(transformed);
      });
      return;
    }
    this.videoApi.getModels(pageNum, this.sortField(), this.sortDesc() ? 'desc' : 'asc').subscribe((response: ModelResponse) => {
      console.log('Model Response:', response);
      this.setMessage(response);
    });
  }
}