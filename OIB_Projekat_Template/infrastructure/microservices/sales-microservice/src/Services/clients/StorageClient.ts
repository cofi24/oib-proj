export type StorageSendPackagingResponse = {
  shipped: number;
  strategy: string;
};

export class StorageClient {
  constructor(private readonly baseUrl: string) {}

  async sendPackaging(userRole: string, amount: number): Promise<StorageSendPackagingResponse> {
    const res = await fetch(`${this.baseUrl}/api/v1/storage/send-packaging`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-role": userRole,
      },
      body: JSON.stringify({ amount }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Storage error (${res.status}): ${text}`);
    }

    return res.json();
  }
}
