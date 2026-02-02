export interface ISalesGatewayService {
  getCatalog<TResponse>(token?: string): Promise<TResponse>;

  checkout<TRequest, TResponse>(
    body: TRequest,
    token?: string,
    userRole?: string
  ): Promise<TResponse>;

  health<TResponse>(): Promise<TResponse>;
}