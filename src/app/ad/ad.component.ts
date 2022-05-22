import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps'

import { IAnuncio } from '../interfaces/ianuncio';
import { ITipo } from '../interfaces/itipo';
import { IMunicipio } from '../interfaces/imunicipio';
import { IProvincia } from '../interfaces/iprovincia';
import { IGeneral } from '../interfaces/igeneral';
import { IMap } from '../interfaces/imap';
import { IAnuncioImagen } from '../interfaces/ianuncioimagen';

import { DataAnunciosService } from '../services/data-anuncios.service';
import { UsuariosService } from '../services/usuarios.service';
import { DataMapService } from '../services/data-map.service';
import { AppComponent } from '../app.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IFavorito } from '../interfaces/ifavorito';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.css']
})
export class AdComponent implements OnInit {

  apiUrl: string = environment.apiUrl;
  errorMessage: string = "";
  msgContacto: string = "";
  id = Number(this.aroute.snapshot.params['id']);

  anuncio?: IAnuncio;
  vendedor?: IGeneral;
  imgs!: IAnuncioImagen[];
  favorito?: number;

  // Maps
  map!: IMap;
  errorMessageMap: string = "";

  latLng!: google.maps.LatLngLiteral;
  label = "";

  marker!: google.maps.MarkerOptions;

  constructor(private anuncioService: DataAnunciosService, private mapService: DataMapService, private route: Router, private aroute: ActivatedRoute,
    private app: AppComponent, private _snackBar: MatSnackBar, private usuariosService: UsuariosService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.anuncioService.getAnuncio(this.id).subscribe((anuncio: IAnuncio) => {
      // Get Vendedor Anuncio
      this.anuncioService.getVendedorAnuncio(anuncio.id).subscribe((vendedor: IGeneral) => {
        anuncio.vendedor = vendedor;
        this.vendedor = vendedor;
      });
      // Get Tipo Anuncio
      this.anuncioService.getTipoAnuncio(anuncio.id).subscribe((tipo: ITipo) => {
        anuncio.tipo = tipo;
      });
      // Get Municipio Anuncio
      this.anuncioService.getMunicipioAnuncio(anuncio.id).subscribe((municipio: IMunicipio) => {
        anuncio.municipio = municipio;
      });
      // Get Provincia Anuncio
      this.anuncioService.getProvinciaAnuncio(anuncio.id).subscribe((provincia: IProvincia) => {
        anuncio.provincia = provincia;
      });
      // Get Imagenes Anuncio
      this.anuncioService.getImagenesAnuncio(anuncio.id).subscribe((imgs: IAnuncioImagen[]) => {
        if (imgs.length > 0) this.imgs = imgs;
      });

      // Maps
      this.mapService.getMap(anuncio).subscribe((map: IMap) => {
        this.latLng = {
          lat: map.data[0].latitude,
          lng: map.data[0].longitude,
        };
        this.label = map.data[0].label;
        this.map = map;
      }, (error) => {
        this.errorMessageMap = error.message;
      });



      this.anuncio = anuncio;
    }, (error) => {
      this.errorMessage = error.message;
    });

    // Fav
    if (this.app.getCookie()) {
      this.usuariosService.getFavoritos().subscribe((favoritos: Array<IFavorito>) => {
        favoritos.forEach(fav => {
          if (fav.anuncio_id == this.anuncio?.id && fav.usuario_id == parseInt(this.app.getCookie())) {
            this.favorito = fav.id;
            document.getElementById("favBtn")!.style.color = "red";
            document.getElementById("favIcon")!.style.color = "red";
          }
        });
      });
    }


  }

  contactarVendedor() {
    if (!this.app.getCookie()) {
      let sb = this._snackBar.open("Debes de iniciar sesión.", "Login", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });

      sb.onAction().subscribe(() => {
        this.route.navigate(['login']);
      });

      return false;
    }

    if (this.msgContacto.length > 0) {
      let imgAd = this.imgs ? this.imgs[0]?.imagen : "https://res.cloudinary.com/inmoanuncios/image/upload/v1653229770/anuncios/casa_ekdkrm.png";
      const dataContacto: Object = { msg: this.msgContacto, idComprador: this.app.getCookie(), idAnuncio: this.anuncio?.id, url: window.location.href, imagen: imgAd };
      this.anuncioService.contactarVendedor(dataContacto).subscribe({
        error: (error) => { this.errorMessage = error.message; }
      });

      this._snackBar.open(this.translate.instant('adDialogo.enviado'), this.translate.instant('adminDialogo.cerrar'), {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
    }
    return true;
  }

  tipoTrans(tipo: any) {
    switch (tipo) {
      case "Piso": return "adlist.floor";
      case "Casa": return "adlist.house";
      case "Alquiler": return "adlist.rent";
      case "Venta": return "adlist.sale";
      default: return "";
    }
  }

  phoneSeparator(numb: number) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return str.join(".");
  }

  viewImage(img: string) {
    return img.replace(/%2F/gm, "/");
  }

  favBtn() {
    if (!this.app.getCookie()) return;

    if (!this.favorito) {
      const data: Object = { anuncio_id: this.anuncio?.id, usuario_id: this.app.getCookie() };
      this.usuariosService.postFavorito(data).subscribe({
        next: () => {
          document.getElementById("favBtn")!.style.color = "red";
          document.getElementById("favIcon")!.style.color = "red";
        },
        error: (error) => { this.errorMessage = error.message; }
      });
    } else {
      this.usuariosService.deleteFavorito(this.favorito).subscribe({
        next: () => {
          document.getElementById("favBtn")!.style.color = "#8888";
          document.getElementById("favIcon")!.style.color = "#8888";
        },
        error: (error) => { this.errorMessage = error.message; }
      });
    }
    return;
  }

}
