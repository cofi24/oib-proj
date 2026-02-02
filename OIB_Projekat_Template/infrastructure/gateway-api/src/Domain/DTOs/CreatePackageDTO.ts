export interface CreatePackageDTO {
    naziv: string;
    adresaPosiljaoca: string;
    skladisteId: number;
    parfemiId: number;
    quantity: number;
    status?: string;
}