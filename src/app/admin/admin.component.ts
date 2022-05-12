import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { IGeneral } from '../interfaces/igeneral';
import { IAnuncio } from '../interfaces/ianuncio';
import {MatTableDataSource} from '@angular/material/table';
import { UsuariosService } from '../services/usuarios.service';
import { DataAnunciosService } from '../services/data-anuncios.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit{

  infoUsuario:any = "";
  errorMessage: any;

  ELEMENT_DATA: IGeneral[] = [];
  ELEMENT_DATA_ANUNCIO: IAnuncio[] = [];

  displayedColumns: string[] = ['id', 'nickname', 'nombre', 'apellidos', 'email', 'telefono', 'acciones'];
  displayedColumns2: string[] = ['id', 'referencia', 'nombre', 'vendedor', 'inmueble', 'trato', 'telefono', 'acciones'];


  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatPaginator) paginator2: MatPaginator | undefined;
  dataSource: any;
  dataSource2: any;
  sort: any;
  sort2: any;

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
  }

  constructor(private usuariosService: UsuariosService, private anunciosService: DataAnunciosService) { }

  ngOnInit(): void {
    this.usuariosService.getGenerales().subscribe((data: any) => {
      data.forEach((element: any) => {
        this.ELEMENT_DATA.push(element);
        this.dataSource = new MatTableDataSource<IGeneral>(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }, (error) => {
      this.errorMessage = error.message;
    });

    this.anunciosService.getData().subscribe((data: any) => {
      data.forEach((element: any) => {
        this.ELEMENT_DATA_ANUNCIO.push(element);
        this.dataSource2 = new MatTableDataSource<IAnuncio>(this.ELEMENT_DATA_ANUNCIO);
        this.dataSource2.paginator2 = this.paginator;
        this.dataSource2.sort = this.sort2;
      });
    }, (error) => {
      this.errorMessage = error.message;
    });

    /*this.usuariosService.getUsuarios().subscribe((data: any) => {
      data.forEach((element: any) => {
        //if (element.nickname) {
          this.ELEMENT_DATA.push(element);
          this.dataSource = new MatTableDataSource<IGeneral>(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        //}
      });
      //this.infoUsuario = data;
    }, (error) => {
      this.errorMessage = error.message; // treurem l'error a html
    });*/

    console.log("ELEMENT->USUARIO", this.ELEMENT_DATA);
    console.log("ELEMENT->ANUNCIO", this.ELEMENT_DATA_ANUNCIO);
  }

  editarUsuario(id:number){
    console.log("Id usuario editar: " + id);
  }

  borrarUsuario(id:number){
    console.log("Id usuario borrar: " + id);
  }

  editarAnuncio(id:number){
    console.log("Id anuncio editar: " + id);
  }

  borrarAnuncio(id:number){
    console.log("Id anuncio borrar: " + id);
  }

}


