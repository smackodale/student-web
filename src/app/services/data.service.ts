import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient, ) { }

  private combineUrl(path: string) {
    return `${window['apiUrl']}/${path}`;
  }

  get<T>(path: string): Observable<T> {
    const url = this.combineUrl(path);
    return this.http.get<T>(url);
  }

  delete(path: string): Observable<any> {
    const url = this.combineUrl(path);
    return this.http.delete(url);
  }

  post<T, U>(path: string, data?: T): Observable<U> {
    const url = this.combineUrl(path);
    return this.http.post<U>(url, data);
  }
}