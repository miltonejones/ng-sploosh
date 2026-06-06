import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  ActorInfo,
  ActorResponse,
  DashModel,
  InsertResponse,
  ModelInfo,
  TrackInfo,
  TrackResponse,
} from './models';

const JSON_HEADERS = new HttpHeaders({ 'Content-Type': 'application/json' });

export interface Parser {
  [key: string]: unknown;
}

export interface Video {
  title: string;
  URL: string;
  models?: { ID: number }[];
  [key: string]: unknown;
}

export interface Model {
  ID: number;
  name: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class VideoApiService {
  private readonly apiEndpoint = 'https://3bax4cg6w7.execute-api.us-east-1.amazonaws.com';
  private readonly photoEndpoint = 'https://58uf2seho0.execute-api.us-east-1.amazonaws.com';
  private readonly javEndpoint = 'https://jhdcmv7zhi.execute-api.us-east-1.amazonaws.com';

  constructor(private http: HttpClient) {}

  // ── Parsers ────────────────────────────────────────────────────────────────

  saveParser(parser: Parser): Observable<unknown> {
    return this.http.post(`${this.apiEndpoint}/parsers`, parser, {
      headers: JSON_HEADERS,
    });
  }

  // ── Videos ─────────────────────────────────────────────────────────────────

  getVideos(page: number = 1): Observable<TrackResponse> {
    return this.http.get<TrackResponse>(`${this.apiEndpoint}/videos/${page}`);
  }

  getVideo(id: number | string): Observable<TrackResponse> {
    return this.http.get<TrackResponse>(`${this.apiEndpoint}/video/${id}`);
  }

  getVideosByDomain(domain: string, page: number): Observable<TrackResponse> {
    return this.http.get<TrackResponse>(`${this.apiEndpoint}/domain/${domain}/${page}`);
  }

  getVideosByKey(keys: string[]): Observable<unknown> {
    return this.http.put(
      `${this.apiEndpoint}/video-keys`,
      { Keys: keys },
      {
        headers: JSON_HEADERS,
      }
    );
  }

  getVideoKeys(keys: string[]): Observable<unknown> {
    return this.http.put(
      `${this.apiEndpoint}/video-ids`,
      { Keys: keys },
      {
        headers: JSON_HEADERS,
      }
    );
  }

  saveVideo(video: TrackInfo): Observable<number> {
    const title = video.title.substring(0, 255);
    const URL = this.formatURL(video.URL);
    return this.http.post<number>(
      `${this.apiEndpoint}/video`,
      { ...video, title, URL },
      {
        headers: JSON_HEADERS,
      }
    );
  }

  deleteVideo(id: number | string): Observable<unknown> {
    return this.http.delete(`${this.apiEndpoint}/video/${id}`, {
      headers: JSON_HEADERS,
    });
  }

  toggleVideoFavorite(id: number | string): Observable<unknown> {
    return this.http.put(
      `${this.apiEndpoint}/toggle-video-heart`,
      { ID: id },
      { headers: JSON_HEADERS }
    );
  }

  findVideos(param: string, page = 1, domain?: string): Observable<TrackResponse> {
    let endpoint = `${this.apiEndpoint}/find/${param}/${page}`;
    if (domain) {
      endpoint += `/${domain}`;
    }
    return this.http.get<TrackResponse>(endpoint); /*.pipe(
      map((res) => {
        if (!exact) return res;
        if (!res.records) return false;
        return (res.records as unknown[])[0];
      })
    );*/
  }

  // ── Models ─────────────────────────────────────────────────────────────────

  getModels(page: number): Observable<unknown> {
    return this.http.get(`${this.apiEndpoint}/models/${page}`);
  }

  getModel(
    id: number | string,
    options: { page?: number; favorite?: boolean; param?: string; domain?: string } = {}
  ): Observable<ActorResponse> {
    const { page = 1, favorite = false, param, domain } = options;
    const suffix = favorite ? '/1' : '';
    let address = `/model/${id}/${page}${suffix}`;

    if (domain?.length) {
      address = `/model-domain/${id}/${page}/${domain}`;
    } else if (param?.length) {
      address = `/model-filter/${id}/${page}/${param}`;
    }

    return this.http.get<ActorResponse>(`${this.apiEndpoint}${address}`);
  }

  getModelsByName(name: string, exact = false): Observable<ModelInfo[]> {
    return this.http.get<ModelInfo[]>(`${this.apiEndpoint}/model-name/${name}`);
  }

  getModelsByTitle(title: string): Observable<unknown> {
    return this.http.put(
      `${this.apiEndpoint}/model-title`,
      { title },
      {
        headers: JSON_HEADERS,
      }
    );
  }

  getModelCostars(id: number | string): Observable<ActorInfo[]> {
    return this.http.get<ActorInfo[]>(`${this.apiEndpoint}/model-costars/${id}`);
  }

  getModelMissingVideos(id: number | string): Observable<unknown> {
    return this.http.get(`${this.apiEndpoint}/model-missing/${id}`);
  }

  addModel(name: string): Observable<InsertResponse> {
    return this.http.put<InsertResponse>(`${this.apiEndpoint}/model/cast/${name}`, null, {
      headers: JSON_HEADERS,
    });
  }

  addModelToVideo(trackFk: number | string, modelFk: number | string): Observable<unknown> {
    return this.getVideo(trackFk).pipe(
      switchMap((response) => {
        const track = response.records[0];
        const alreadyExists = track?.models?.some((m) => m.ID === modelFk);
        if (alreadyExists) {
          return [{ message: `Model ${modelFk} already exists on video ${trackFk}` }];
        }
        return this.http.put(
          `${this.apiEndpoint}/model/cast`,
          { trackFk, modelFk },
          { headers: JSON_HEADERS }
        );
      })
    );
  }

  removeModelFromVideo(trackFk: number | string, modelFk: number | string): Observable<unknown> {
    return this.http.delete(`${this.apiEndpoint}/model/cast/${trackFk}/${modelFk}`);
  }

  addModelAlias(modelFk: number | string, aliasFk: number | string): Observable<unknown> {
    return this.http.put(
      `${this.apiEndpoint}/add-model-alias`,
      { modelFk, aliasFk },
      { headers: JSON_HEADERS }
    );
  }

  updateModelPhoto(id: number | string, image: string): Observable<unknown> {
    return this.http.put(
      `${this.apiEndpoint}/add-model-photo`,
      { id, image },
      { headers: JSON_HEADERS }
    );
  }

  // ── Favorites ──────────────────────────────────────────────────────────────

  getFavorites(page: number): Observable<TrackResponse> {
    return this.http.get<TrackResponse>(`${this.apiEndpoint}/favorite/${page}`);
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────

  getDash(): Observable<DashModel[]> {
    return this.http.get<DashModel[]>(`${this.apiEndpoint}/dash`);
  }

  // ── JAV / Photos ───────────────────────────────────────────────────────────

  getVideoInfo(key: string): Observable<TrackResponse> {
    return this.http.get<TrackResponse>(`${this.javEndpoint}/${key}`);
  }

  getPhoto(name: string): Observable<unknown> {
    return this.http.get(`${this.photoEndpoint}/${name}/1`);
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private formatURL(url: string): string {
    if (url?.length > 255) {
      const match = /([a-zA-Z]+-\d+)/.exec(url);
      if (match) {
        return `https://javdoe.to/search/movie/${match[1]}`;
      }
    }
    return url;
  }
}
