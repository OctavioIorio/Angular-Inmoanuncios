import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUsuario } from '../interfaces/iusuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  apiUrl: string = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  public postUsuario(register: any): Observable<any> {
    return this._http.post(`${this.apiUrl}/api/general`, register);
  }

  getUsuarios(): Observable<IUsuario[]> {
    return this._http.get<IUsuario[]>(`${this.apiUrl}/api/usuarios`);
  }
}
