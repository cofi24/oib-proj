import { PaymentMethod } from "../enums/PaymentMethod";
import { SaleType } from "../enums/SaleType";

export type BuyItemDTO = {
  productId: number;
  quantity: number;
};

export type BuyRequestDTO = {
  saleType: SaleType;
  paymentMethod: PaymentMethod;
  items: BuyItemDTO[];
};
