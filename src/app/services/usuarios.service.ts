import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAnuncio } from '../interfaces/ianuncio';
import { IFavorito } from '../interfaces/ifavorito';
import { IGeneral } from '../interfaces/igeneral';
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

  getGenerales(): Observable<IGeneral[]> {
    return this._http.get<IGeneral[]>(`${this.apiUrl}/api/generals`);
  }

  public getUsuarioGenConcreto(id: number): Observable<any> {
    return this._http.get(`${this.apiUrl}/api/general/` + id);
  }

  public editUsuarioGenConcreto(id: number, datos: any): Observable<any> {
    return this._http.post<IGeneral>(`${this.apiUrl}/api/general/` + id, datos);
  }

  public deleteUsuarioGenConcreto(id: number): Observable<any> {
    return this._http.delete(`${this.apiUrl}/api/general/` + id);
  }

  getFavoritos(): Observable<IFavorito[]> {
    let result = this._http.get<IFavorito[]>(`${this.apiUrl}/api/favoritos`);
    return result;
  }

  getFavorito(id: number): Observable<IFavorito> {
    let result = this._http.get<IFavorito>(`${this.apiUrl}/api/favorito/${id}`);
    return result;
  }

  postFavorito(data: Object): Observable<any> {
    let result = this._http.post<any>(`${this.apiUrl}/api/favorito`, data);
    return result;
  }

  deleteFavorito(id: number): Observable<any> {
    return this._http.delete(`${this.apiUrl}/api/favorito/` + id);
  }

  getUsuarioFavorito(id: number): Observable<IGeneral> {
    let result = this._http.get<IGeneral>(`${this.apiUrl}/api/favorito/usuario/${id}`);
    return result;
  }

  getAnuncioFavorito(id: number): Observable<IAnuncio> {
    let result = this._http.get<IAnuncio>(`${this.apiUrl}/api/favorito/anuncio/${id}`);
    return result;
  }
  
  public verificarAdmin(id: number): Observable<any> {
    return this._http.get(`${this.apiUrl}/api/admin/` + id);
  }

}
