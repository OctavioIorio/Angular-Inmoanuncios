import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { ITipo } from '../interfaces/itipo';

@Injectable({
  providedIn: 'root'
})
export class DataTiposService {

  apiUrl: string = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  getData(): Observable<ITipo[]> {
    let result = this._http.get<ITipo[]>(`${this.apiUrl}/api/tipos`);
    return result;
  }
}
