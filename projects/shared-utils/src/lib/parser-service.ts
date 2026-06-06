import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TrackInfo } from './models';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_ENDPOINT = 'https://pqapeldcug.execute-api.us-east-1.amazonaws.com/';
const JSON_HEADERS = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable({
  providedIn: 'root',
})
export class ParserService {
  constructor(private http: HttpClient) {}

  getVideoByURL(uri: string): Observable<TrackInfo> {
    return this.http.post<TrackInfo>(API_ENDPOINT, { uri }, { headers: JSON_HEADERS });
  }
}
