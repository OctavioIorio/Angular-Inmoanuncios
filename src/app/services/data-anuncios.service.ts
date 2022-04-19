import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { IAnuncio } from '../interfaces/ianuncio';

@Injectable({
  providedIn: 'root'
})
export class DataAnunciosService {

  apiUrl: string = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  getData(): Observable<IAnuncio[]> {
    let result = this._http.get<IAnuncio[]>(`${this.apiUrl}/api/anuncios`);
    return result;
  }
}
