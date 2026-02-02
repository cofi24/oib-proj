export type PerfumeType = "PARFEM" | "KOLONJSKA_VODA";

export interface PerfumeDTO {
  id: number;
  naziv: string;
  tip: PerfumeType;
  netoMl: number;
  serijskiBroj: string;
  cena: number;
  dostupno: number;
}