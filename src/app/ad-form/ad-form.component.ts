import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { IAnuncio } from '../interfaces/ianuncio';
import { ITipo } from '../interfaces/itipo';
import { IMunicipio } from '../interfaces/imunicipio';
import { IProvincia } from '../interfaces/iprovincia';
import { IGeneral } from '../interfaces/igeneral';

import { DataAnunciosService } from '../services/data-anuncios.service';
import { DataTiposService } from '../services/data-tipos.service';
import { DataMunicipiosService } from '../services/data-municipios.service';
import { HomeComponent } from '../home/home.component';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-ad-form',
  templateUrl: './ad-form.component.html',
  styleUrls: ['./ad-form.component.css']
})
export class AdFormComponent implements OnInit {

  myForm: FormGroup;
  myControl = new FormControl();
  errorMessage: string = "";
  apiUrl: string = environment.apiUrl;
  anuncio!: IAnuncio;
  tipos: ITipo[] = [];
  provincias: IProvincia[] = [];
  municipios: IMunicipio[] = [];
  tratos: any[] = [
    { nombre: 'adlist.rent', valor: 'Alquiler' },
    { nombre: 'adlist.sale', valor: 'Venta' }
  ];
  missatge = '';
  images: string[] = [];
  imagesF: string[] = [];

  // Form inputs anuncio
  tipoSelected: number = 0;
  municipioSelected: number = 0;
  provinciaSelected: number = 0;
  referencia: string = "";
  precioMin: number = 0;
  precioMax: number = 0;
  areaMin: number = 0;
  areaMax: number = 0;
  tratoSelected: string = "";
  habitaciones: number = 0;

  filteredMunicipios!: Observable<IMunicipio[]>;
  filteredProvincias!: Observable<IProvincia[]>;

  constructor(private formBuilder: FormBuilder, private anuncioService: DataAnunciosService,
    private tipoService: DataTiposService, private municipioService: DataMunicipiosService,
    private route: Router, public dialogRef: MatDialogRef<AdFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: string }, private _snackBar: MatSnackBar) {
    this.myForm = this.createForm();
  }

  ngOnInit(): void {
    this.myForm = this.createForm();
    // Get Tipos
    this.tipoService.getData().subscribe((tipos: Array<ITipo>) => {
      this.tipos = tipos;
    });

    // Get Provincias alphabetically sorted
    this.municipioService.getProvincias().subscribe((provincias: IProvincia[]) => {
      this.provincias = provincias.sort((a, b) => a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase()))

      // Autocomplete Provincias
      this.filteredProvincias = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value.nombre)),
        map(nombre => (nombre ? this._filterProv(nombre) : this.provincias.slice())),
      );
    });

    // Get Municipios alphabetically sorted
    this.municipioService.getMunicipios().subscribe((municipios: IMunicipio[]) => {
      this.municipios = municipios.sort((a, b) => a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase()))

      // Autocomplete Municipios
      this.filteredMunicipios = this.munisFiltered();
    });
  }

  munisFiltered() {
    return this.myForm.controls["municipio_id"].valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.nombre)),
      map(nombre => (nombre ? this._filterMun(nombre)
        .filter(municipio => municipio.provincia_id === this.provinciaSelected) : this.municipios.slice()
          .filter(municipio => municipio.provincia_id === this.provinciaSelected))),
    );
  }

  get f() {
    return this.myForm.controls;
  }

  onFileChange(event: any) {
    this.images = [];
    this.imagesF = [];
    if (event.target.files && event.target.files[0]) {
      for (let i = 0; i < event.target.files.length; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          this.images.push(event.target.result);

          this.myForm.patchValue({
            fileSource: this.images
          });
        }
        this.imagesF.push(event.target.files[i]);
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  displayFnProv(id: number): string {
    if (!id) return '';

    this.provinciaSelected = id;

    let index = this.provincias.findIndex(provincia => provincia.id === id);
    return this.provincias[index].nombre;
  }

  displayFnMun(municipio: IMunicipio): string {
    return municipio && municipio.nombre ? municipio.nombre : '';
  }

  private _filterProv(nombre: string): IProvincia[] {
    const filterValue = nombre.toLowerCase();

    return this.provincias.filter(provincia => provincia.nombre.toLowerCase().includes(filterValue));
  }

  private _filterMun(nombre: string): IMunicipio[] {
    const filterValue = nombre.toLowerCase();

    return this.municipios.filter(municipio => municipio.nombre.toLowerCase().includes(filterValue));
  }

  createForm() {
    return this.formBuilder.group({
      file: [null],
      municipio_id: [null, [Validators.required]],
      cp: [null, [Validators.required, Validators.min(9999), Validators.max(99999)]],
      precio: [null, [Validators.required]],
      tipo_id: [null, [Validators.required]],
      trato: [null, [Validators.required]],
      habitaciones: [null],
      area: [null],
      descripcion: [null],
      calle: [null],
      num: [null],
    });
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.get('imagen')?.setValue(file);
    }
  }

  onSubmit() {
    if (!this.myForm.valid) {
      return;
    }
    //https://www.positronx.io/how-to-use-angular-8-httpclient-to-post-formdata/
    //https://www.techiediaries.com/angular-formdata/

    const formData = new FormData();
    var file = this.myForm.get('file');
    var municipio_id = this.myForm.get('municipio_id');
    var cp = this.myForm.get('cp');
    var precio = this.myForm.get('precio');
    var tipo_id = this.myForm.get('tipo_id');
    var trato = this.myForm.get('trato');
    var habitaciones = this.myForm.get('habitaciones');
    var area = this.myForm.get('area');
    var descripcion = this.myForm.get('descripcion');
    var calle = this.myForm.get('calle');
    var num = this.myForm.get('num');

    if (this.imagesF.length > 0) formData.append("imagen", this.imagesF[0]);
    formData.append("referencia", this.randomReferencia());
    formData.append("vendedor_id", this.data.user);
    let cDate = new Date(); formData.append("created_at", `${cDate.getFullYear()}-${('0' + (cDate.getMonth() + 1)).slice(-2)}-${('0' + cDate.getDate()).slice(-2)} ${('0' + cDate.getHours()).slice(-2)}:${('0' + cDate.getMinutes()).slice(-2)}:${('0' + cDate.getSeconds()).slice(-2)}`);
    if (municipio_id) formData.append("municipio_id", municipio_id.value.id);
    if (cp) formData.append("cp", cp.value);
    if (precio) formData.append("precio", precio.value);
    if (tipo_id) formData.append("tipo_id", tipo_id.value);
    if (trato) formData.append("trato", trato.value);
    if (habitaciones) formData.append("habitaciones", habitaciones.value);
    if (area) formData.append("area", area.value);
    if (descripcion) formData.append('descripcion', descripcion.value);
    if (calle) formData.append("calle", calle.value);
    if (num) formData.append("num", num.value);

    console.log(formData);

    this.anuncioService.postAnuncio(formData).subscribe({
      next: (res) => {
        console.log(res);
        // this.route.navigate(['home']);
        this.dialogRef.close();
        this.openSnackBar();
      },
      error: (error) => { this.errorMessage = error.message; }
    });
  }

  noValid(nControl: string): boolean {
    let cc = this.myForm.get(nControl);
    if (!cc) return true;
    return (!cc.valid &&
      cc.touched);
  }

  getErrorMessage(nControl: string): string {
    const ctl = this.myForm.get(nControl);
    if (!ctl) return 'Control Erroneo';
    let str = '';
    switch (nControl) {
      case 'cp':
        str = ctl.hasError('required') ? 'Campo obligatorio' :
          ctl.hasError('min') ? '5 carácteres mínimo' :
            ctl.hasError('max') ? '5 carácteres máximo' : '';
        break;
      case 'precio':
        str = ctl.hasError('required') ? 'Campo obligatorio' : '';
        break;
      case 'provincia_id':
        str = ctl.hasError('required') ? 'Campo obligatorio' : '';
        break;
      case 'municipio_id':
        str = ctl.hasError('required') ? 'Campo obligatorio' : '';
        break;
      case 'tipo_id':
        str = ctl.hasError('required') ? 'Campo obligatorio' : '';
        break;
      case 'trato':
        str = ctl.hasError('required') ? 'Campo obligatorio' : '';
        break;
      default:
        // Missatges de 'description': per template
        str = 'Control inválido';
    };

    return str;
  }

  randomReferencia() {
    let result: string = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  openSnackBar() {
    this._snackBar.open("Anuncio creado", "Cerrar", {
      duration: 5000,
      horizontalPosition: 'left',
      verticalPosition: 'bottom'
    });
  }

}