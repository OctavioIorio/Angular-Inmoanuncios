import { IUsuario } from "./iusuario";

export interface IGeneral {
    generalId: IUsuario["usuarioId"];
    generalNombre: string;
    generalApellidos: string;
    generalEmail: string;
    generalTelefono: number;
    generalImagen: string;
}
