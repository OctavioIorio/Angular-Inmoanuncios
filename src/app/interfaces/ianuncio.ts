import { IMunicipio } from "./imunicipio";
import { IGeneral } from "./igeneral";
import { ITipo } from "./itipo";

export interface IAnuncio {
    id: number;
    referencia: string;
    vendedor_id: IGeneral["generalId"];
    imagen: string;
    municipio_id: IMunicipio["municipioId"];
    cp: number;
    precio: number;
    tipo_id: ITipo["tipoId"];
    trato: string;
    habitaciones: number;
    area: number;
    descripcion: string;
    created_at: Date;
}
