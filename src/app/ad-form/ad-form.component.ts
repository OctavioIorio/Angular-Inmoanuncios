import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { IAnuncio } from '../interfaces/ianuncio';
import { ITipo } from '../interfaces/itipo';
import { IMunicipio } from '../interfaces/imunicipio';
import { IProvincia } from '../interfaces/iprovincia';
import { IGeneral } from '../interfaces/igeneral';

import { DataAnunciosService } from '../services/data-anuncios.service';
import { DataTiposService } from '../services/data-tipos.service';
import { DataMunicipiosService } from '../services/data-municipios.service';

@Component({
  selector: 'app-ad-form',
  templateUrl: './ad-form.component.html',
  styleUrls: ['./ad-form.component.css']
})
export class AdFormComponent implements OnInit {

  myForm: FormGroup;
  errorMessage: string = "";
  apiUrl: string = environment.apiUrl;
  anuncio!: IAnuncio;
  tipos: ITipo[] = [];
  municipios: IMunicipio[] = [];
  tratos: string[] = ['Alquiler', 'Venta'];
  missatge = '';
  filteredOptions!: Observable<IMunicipio[]>;

  // Form inputs anuncio
  tipoSelected: number = 0;
  municipioSelected: number = 0;
  referencia: string = "";
  precioMin: number = 0;
  precioMax: number = 0;
  areaMin: number = 0;
  areaMax: number = 0;
  tratoSelected: string = "";
  habitaciones: number = 0;

  constructor(private formBuilder: FormBuilder, private anuncioService: DataAnunciosService,
    private tipoService: DataTiposService, private municipioService: DataMunicipiosService, private route: Router) {
    this.myForm = this.createForm();
  }

  ngOnInit(): void {
    // Get Tipos
    this.tipoService.getData().subscribe((tipos: Array<ITipo>) => {
      this.tipos = tipos;
    });
    // Get Municipios
    this.municipioService.getData().subscribe((municipios: Array<IMunicipio>) => {
      this.municipios = municipios;
    });

    this.filteredOptions = this.myForm.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: string): IMunicipio[] {
    const filterValue = value;

    return this.municipios.filter(municipio => municipio.nombre.toLowerCase().includes(filterValue));
  }

  createForm() {
    return this.formBuilder.group({
      imagen: [null, [Validators.required]],
      municipio_id: [null, [Validators.required]],
      cp: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      precio: [null, [Validators.required]],
      tipo_id: [null, [Validators.required]],
      trato: [null, [Validators.required]],
      habitaciones: [null, [Validators.required, Validators.min(1)]],
      area: [null, [Validators.required, Validators.min(1)]],
      descripcion: [null, [Validators.required, Validators.minLength(5)]],
      calle: [null, []],
      num: [null, []],
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

    // const formData = new FormData();
    // var titol = this.myForm.get('titol');
    // var cantant = this.myForm.get('cantant');
    // var escritor = this.myForm.get('escritor');
    // var productor = this.myForm.get('productor');
    // var duracio = this.myForm.get('duracio');
    // var genere = this.myForm.get('genere');
    // var imatge = this.myForm.get('imatge');

    // if (titol) formData.append("titol", titol.value);
    // if (cantant) formData.append("cantant", cantant.value);
    // if (escritor) formData.append("escritor", escritor.value);
    // if (productor) formData.append("productor", productor.value);
    // if (duracio) formData.append("duracio", duracio.value);
    // if (genere) formData.append("genere", genere.value);
    // if (imatge) formData.append('imatge', imatge.value);  

    // this.cancoService.postCanco(formData).subscribe({
    //   next: (res) => {
    //     console.log(res);
    //     this.route.navigate(['listCancons']);
    //   },
    //   error: (error) => { this.errorMessage = error.message; }
    // });
  }

  noValid(nControl: string): boolean {
    let cc = this.myForm.get(nControl);
    if (!cc) return true;
    return (!cc.valid &&
      cc.touched);
  }

  getErrorMessage(nControl: string): string {
    const ctl = this.myForm.get(nControl);
    if (!ctl) return 'Control Erroni';
    let str = '';
    switch (nControl) {
      case 'titol':
        str = ctl.hasError('required') ? 'Camp obligatori' :
          ctl.hasError('minlength') ? '3 caràcters mínim' : '';
        break;
      case 'cantant':
        str = ctl.hasError('required') ? 'Camp obligatori' :
          ctl.hasError('minlength') ? '3 caràcters mínim' : '';
        break;
      case 'escritor':
        str = ctl.hasError('required') ? 'Camp obligatori' :
          ctl.hasError('minlength') ? '3 caràcters mínim' : '';
        break;
      case 'productor':
        str = ctl.hasError('required') ? 'Camp obligatori' :
          ctl.hasError('minlength') ? '3 caràcters mínim' : '';
        break;
      case 'duracio':
        str = ctl.hasError('required') ? 'Camp obligatori' : '';
        break;
      case 'genere':
        str = ctl.hasError('required') ? 'Camp obligatori' : '';
        break;
      case 'imatge':
        str = ctl.hasError('required') ? 'Camp obligatori' : '';
        break;
      default:
        // Missatges de 'description': per template
        str = 'control invalid';
    };

    return str;
  }

}
