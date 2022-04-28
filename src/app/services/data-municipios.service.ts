import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { IMunicipio } from '../interfaces/imunicipio';

@Injectable({
  providedIn: 'root'
})
export class DataMunicipiosService {

  apiUrl: string = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  getData(): Observable<IMunicipio[]> {
    let result = this._http.get<IMunicipio[]>(`${this.apiUrl}/api/municipios`);
    return result;
  }

}
