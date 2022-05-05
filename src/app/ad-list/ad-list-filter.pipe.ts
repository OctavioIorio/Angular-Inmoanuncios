import { Pipe, PipeTransform } from '@angular/core';
import { IAnuncio } from '../interfaces/ianuncio';

@Pipe({
  name: 'adListFilter'
})
export class AdListFilterPipe implements PipeTransform {

  transform(pageAnuncios: IAnuncio[], filterByReferencia: string, filterByTipo: number, filterByPrecioMin: number, filterByPrecioMax: number, filterByAreaMin: number, filterByAreaMax: number, filterByTrato: string, filterByHabitaciones: number): IAnuncio[] {
    filterByReferencia = filterByReferencia ? filterByReferencia.toLowerCase() : "";
    return pageAnuncios.filter((anuncio) => {
      if (filterByReferencia && anuncio.referencia.toLowerCase().indexOf(filterByReferencia) === -1) {
        return false;
      }
      if (filterByTipo && anuncio.tipo.id !== filterByTipo) {
        return false;
      }
      if (filterByPrecioMin && anuncio.precio <= filterByPrecioMin) {
        return false;
      }
      if (filterByPrecioMax && anuncio.precio >= filterByPrecioMax) {
        return false;
      }
      if (filterByAreaMin && anuncio.area <= filterByAreaMin) {
        return false;
      }
      if (filterByAreaMax && anuncio.area >= filterByAreaMax) {
        return false;
      }
      if (filterByTrato && anuncio.trato != filterByTrato.valueOf()) {
        return false;
      }
      if (filterByHabitaciones && filterByHabitaciones < 4) {
        if (anuncio.habitaciones != filterByHabitaciones) {
          return false;
        }
      } else if (filterByHabitaciones && anuncio.habitaciones <= filterByHabitaciones - 1) {
        return false;
      }

      return true;
    });
  }

}
