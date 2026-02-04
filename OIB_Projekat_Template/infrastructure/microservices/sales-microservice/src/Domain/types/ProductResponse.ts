export type ProductResponse = {
  id: number;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  volumeMl?: number;
  batchInfo?: string;
}