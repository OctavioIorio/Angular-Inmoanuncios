import { IProvincia } from "./iprovincia";

export interface IMunicipio {
    id: number;
    nombre: string;
    provincia_id: IProvincia["id"];
}
