import { SaleType } from "../../enums/SalesEnums/SaleType";
import { PaymentMethod } from "../../enums/SalesEnums/PaymentMethod";

export type BuyItemDTO = {
  productId: number;
  quantity: number;
};

export type BuyRequestDTO = {
  saleType: SaleType;
  paymentMethod: PaymentMethod;
  items: BuyItemDTO[];
};
