import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IMunicipio } from '../interfaces/imunicipio';
import { IProvincia } from '../interfaces/iprovincia';
import { DataAnunciosService } from '../services/data-anuncios.service';
import { DataMunicipiosService } from '../services/data-municipios.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  myForm: FormGroup;
  myControl = new FormControl();
  errorMessage: string = "";

  filteredMunicipios!: Observable<IMunicipio[]>;
  filteredProvincias!: Observable<IProvincia[]>;

  provincias: IProvincia[] = [];
  municipios: IMunicipio[] = [];
  municipioSelected: number = 0;
  provinciaSelected: number = 0;

  constructor(private formBuilder: FormBuilder, private anuncioService: DataAnunciosService,
    private municipioService: DataMunicipiosService, private route: Router) {
    this.myForm = this.createForm();
  }

  ngOnInit(): void {
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

  createForm() {
    return this.formBuilder.group({
      municipio_id: [null, [Validators.required]],
    });
  }

  noValid(nControl: string): boolean {
    let cc = this.myForm.get(nControl);
    if (!cc) return true;
    return (!cc.valid &&
      cc.touched);
  }

  con() {
    console.log(this.myForm.get('municipio_id')?.value.id);
  }

  onSubmit() {
    if (!this.myForm.valid) {
      return;
    }

    this.route.navigate([`/ad-list/${this.myForm.get('municipio_id')?.value?.id}`]);
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

}
