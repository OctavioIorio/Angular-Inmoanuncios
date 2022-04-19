import { IProvincia } from "./iprovincia";

export interface IMunicipio {
    municipioId: number;
    municipioNombre: string;
    municipioProvincia_id: IProvincia["provinciaId"];
}
