import { PaymentMethod } from "../enums/Payment";
import { SaleType } from "../enums/SaleType";

export type ReceiptItem = {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type ReceiptResponse = {
  receiptId: string;
  createdAt: string;
  saleType: SaleType;
  paymentMethod: PaymentMethod;
  items: ReceiptItem[];
  grandTotal: number;
};
