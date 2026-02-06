import QRCode from "qrcode";

export async function generateReceiptQr(payload: any): Promise<string> {
  return QRCode.toDataURL(JSON.stringify(payload), {
    errorCorrectionLevel: "M",
    type: "image/png",
    margin: 2,
    scale: 6,
  });
}