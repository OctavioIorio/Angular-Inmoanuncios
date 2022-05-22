import { IMunicipio } from "./imunicipio";
import { IProvincia } from "./iprovincia";
import { IGeneral } from "./igeneral";
import { ITipo } from "./itipo";

export interface IAnuncio {
    anuncio: any;
    id: number;
    referencia: string;
    vendedor_id: IGeneral["id"];
    imagen: string;
    municipio_id: IMunicipio["id"];
    cp: string;
    precio: number;
    tipo_id: ITipo["id"];
    trato: string;
    habitaciones: number;
    area: number;
    descripcion: string;
    created_at: Date;
    tipo: ITipo;
    municipio: IMunicipio;
    vendedor: IGeneral;
    provincia: IProvincia;
    calle: string;
    num: number;
}
