export interface UserState {
  username: string;
  role: string;
}

export interface LaunchWindow {
  window: Window | null;
  video: TrackInfo;
  index: number;
}

export interface WindowRegion {
  width: number;
  height: number;
  x: number;
  y: number;
  on?: boolean;
  src?: string;
}

export interface DashModel {
  ID: number;
  name: string;
  image: string;
  FaveCount: number;
}

export interface InsertResponse {
  insertId: number;
}

export interface TrackInfo {
  ID: number;
  title: string;
  src: string;
  image?: string | null;
  URL: string;
  domain: string;
  dateAdded: any;
  modelFk: number;
  width: number;
  height: number;
  favorite: any;
  models: ModelInfo[];
  studio: string;
  Key: string;
}

export interface ModelInfo {
  trackFk: number;
  ID: number;
  Name: string;
  name?: string;
  image?: string | null;
}

export interface DomainCountInfo {
  amt: number;
  domain: string;
}

export interface TrackResponse {
  count: number;
  domains?: DomainCountInfo[];
  records: TrackInfo[];
}

export interface ActorInfo {
  ID: number;
  name: string;
  image: string;
}

export interface DomainInfo {
  domain: string;
}

export interface AliasInfo {
  ID: number;
  alias: string;
  image: string;
}

export interface ActorResponse {
  aliases: AliasInfo[];
  domains: DomainInfo[];
  model: ActorInfo[];
  videos: TrackResponse;
}

export const APP_VERSION = 'v1.0.0-native-fed';
