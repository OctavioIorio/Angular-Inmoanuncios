import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { IGeneral } from '../interfaces/igeneral';
import { IAnuncio } from '../interfaces/ianuncio';
import { MatTableDataSource } from '@angular/material/table';
import { UsuariosService } from '../services/usuarios.service';
import { DataAnunciosService } from '../services/data-anuncios.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '../dialogo-confirmacion/dialogo-confirmacion.component';
import { DialogEditProfileComponent } from '../dialog-edit-profile/dialog-edit-profile.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { AdEditComponent } from '../ad-edit/ad-edit.component';
import { IProvincia } from '../interfaces/iprovincia';
import { IMunicipio } from '../interfaces/imunicipio';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {

  infoUsuario: any = "";
  errorMessage: any;
  filterUsuario!: string;

  ELEMENT_DATA: IGeneral[] = [];
  ELEMENT_DATA_ANUNCIO: IAnuncio[] = [];

  displayedColumns: string[] = ['id', 'nombre', 'apellidos', 'email', 'telefono', 'imagen', 'acciones'];
  displayedColumns2: string[] = ['id', 'referencia', 'vendedor', 'inmueble', 'trato', 'telefono', 'acciones'];


  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild('MatPaginator2') paginator2: MatPaginator | undefined;
  dataSource: any;
  dataSource2: any;
  sort: any;
  sort2: any;

  ngAfterViewInit() { }

  constructor(private usuariosService: UsuariosService, private anunciosService: DataAnunciosService, public dialog: MatDialog, private _snackBar: MatSnackBar, private route: Router, private app: AppComponent, private translate: TranslateService) { }

  ngOnInit(): void {
    if (!this.app.getAdmin()) this.route.navigate(['login']);
    this.getAllUsuarios();
    this.getAllAnuncios();
  }

  getAllUsuarios() {
    this.usuariosService.getGenerales().subscribe((data: any) => {
      data.forEach((element: any) => {
        Object.assign(element, { perfil: element.imagen?.replace(/%2F/gm, "/") });
        this.ELEMENT_DATA.push(element);
        this.dataSource = new MatTableDataSource<IGeneral>(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }, (error) => {
      this.errorMessage = error.message;
    });
  }

  getAllAnuncios() {
    this.anunciosService.getData().subscribe((data: any) => {
      data.forEach((element: any) => {
        if (element.tipo_id) {
          this.anunciosService.getTipo(element.tipo_id).subscribe((data: any) => {
            Object.assign(element, { tipo: data.nombre });
          }, (error) => {
            this.errorMessage = error.message;
          });
          // Get Provincia Anuncio
          this.anunciosService.getProvinciaAnuncio(element.id).subscribe((provincia: IProvincia) => {
            Object.assign(element, { provincia: provincia });
          });
          // Get Municipio Anuncio
          this.anunciosService.getMunicipioAnuncio(element.id).subscribe((municipio: IMunicipio) => {
            Object.assign(element, { municipio: municipio });
          });
        }

        if (element.vendedor_id) {
          this.usuariosService.getUsuarioGenConcreto(element.vendedor_id).subscribe((data: any) => {
            Object.assign(element, { vendedor: data.nombre });
            Object.assign(element, { telefono: data.telefono });
          }, (error) => {
            this.errorMessage = error.message;
          });
        }

        this.ELEMENT_DATA_ANUNCIO.push(element);
        this.dataSource2 = new MatTableDataSource<IAnuncio>(this.ELEMENT_DATA_ANUNCIO);
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort2 = this.sort2;
      });
    }, (error) => {
      this.errorMessage = error.message;
    });
  }

  filtrarUsuario(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  filtrarAnuncio(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filtro.trim().toLowerCase();
  }

  editarUsuario(id: number) {
    this.dialog.open(DialogEditProfileComponent, {
      width: '1080px',
      data: { id: id },
    }).afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.ELEMENT_DATA.splice(0, this.ELEMENT_DATA.length);
          this.getAllUsuarios();
        } else {
          return;
        }
      });
  }

  dialogoBorrarUsuario(id: number) {
    this.dialog
      .open(DialogoConfirmacionComponent, {
        data: "adminDialogo.borrarUsuario"
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.borrarUsuario(id);
        } else {
          return;
        }
      });
  }

  borrarUsuario(id: number) {
    this.usuariosService.deleteUsuarioGenConcreto(id).subscribe((usuario: Array<IGeneral>) => {
      this.notificacionUsuarioBorrado();
      this.ELEMENT_DATA.splice(0, this.ELEMENT_DATA.length);
      this.getAllUsuarios();
    }, (error) => {
      this.errorMessage = error.message;
    });
  }

  openDialogEdit(ad: any): void {
    const dialogRef = this.dialog.open(AdEditComponent, {
      width: '1080px',
      data: { anuncio: ad },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ELEMENT_DATA_ANUNCIO.splice(0, this.ELEMENT_DATA_ANUNCIO.length);
      this.getAllAnuncios();
    });
  }

  dialogoBorrarAnuncio(id: number) {
    this.dialog
      .open(DialogoConfirmacionComponent, {
        data: "adminDialogo.borrarAnuncio"
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.borrarAnuncio(id);
          this.notificacionAnuncioBorrado();
        } else {
          return;
        }
      });
  }

  borrarAnuncio(id: number) {
    this.anunciosService.deleteAnuncio(id).subscribe((anuncio: Array<IAnuncio>) => {
      this.notificacionAnuncioBorrado();
      this.ELEMENT_DATA_ANUNCIO.splice(0, this.ELEMENT_DATA_ANUNCIO.length);
      this.getAllAnuncios();
    }, (error) => {
      this.errorMessage = error.message;
    });
  }

  notificacionUsuarioBorrado() {
    this._snackBar.open(this.translate.instant('adminDialogo.borradoUsuario'), this.translate.instant('adminDialogo.cerrar'), {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

  notificacionAnuncioBorrado() {
    this._snackBar.open(this.translate.instant('adminDialogo.borradoAnuncio'), this.translate.instant('adminDialogo.cerrar'), {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

}


