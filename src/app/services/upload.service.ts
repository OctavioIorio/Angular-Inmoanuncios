import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private _http: HttpClient) {}

  uploadImage(vals: FormData): Observable<any>{
    let data = vals;
    return this._http.post('https://api.cloudinary.com/v1_1/inmoanuncios/image/upload',data)
  }
}
