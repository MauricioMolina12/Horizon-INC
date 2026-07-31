import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  public baseUrl: string = environment.BASE_URL;
  public baseRetry: number = 4;

  constructor(public http: HttpClient) {}

  public get(url: string, base?: any) {
    url = base !== false ? (base || this.baseUrl) + url : url;
    return this.http.get(url);
  }

  public post(url: string, data: any, base?: any) {
    url = base !== false ? (base || this.baseUrl) + url : url;
    return this.http.post(url, data);
  }

  public put(url: string, data: any, base?: any) {
    url = base !== false ? (base || this.baseUrl) + url : url;
    return this.http.put(url, data);
  }

  public delete(url: string, base?: any) {
    url = base !== false ? (base || this.baseUrl) + url : url;
    return this.http.delete(url);
  }
}