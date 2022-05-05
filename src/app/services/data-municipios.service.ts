import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { IMunicipio } from '../interfaces/imunicipio';
import { IProvincia } from '../interfaces/iprovincia';

@Injectable({
  providedIn: 'root'
})
export class DataMunicipiosService {

  apiUrl: string = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  getMunicipios(): Observable<IMunicipio[]> {
    return this._http.get<IMunicipio[]>(`${this.apiUrl}/api/municipios`);
  }

  getProvincias(): Observable<IProvincia[]> {
    return this._http.get<IProvincia[]>(`${this.apiUrl}/api/provincias`);
  }

}
