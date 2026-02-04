import { SaleType } from "../../enums/SaleType";
import { PaymentMethod } from "../../enums/Payment";

export type BuyItemDTO = {
  productId: number;
  quantity: number;
};

export type BuyRequestDTO = {
  saleType: SaleType;
  paymentMethod: PaymentMethod;
  items: BuyItemDTO[];
};
