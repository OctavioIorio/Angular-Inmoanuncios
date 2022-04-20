import { IUsuario } from "./iusuario";

export interface IGeneral {
    id: IUsuario["id"];
    nombre: string;
    apellidos: string;
    email: string;
    telefono: number;
    imagen: string;
}
