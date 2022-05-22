import { IAnuncio } from "./ianuncio";
import { IGeneral } from "./igeneral";

export interface IFavorito {
    id: number;
    anuncio_id: number;
    usuario_id: number;
    usuario: IGeneral;
    anuncio: IAnuncio;
}
