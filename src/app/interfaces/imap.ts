import { IAnuncio } from '../interfaces/ianuncio';

export interface IMap {
    data: [
        {
            latitude: number;
            longitude: number;
            label: string;
        }
    ]
}
