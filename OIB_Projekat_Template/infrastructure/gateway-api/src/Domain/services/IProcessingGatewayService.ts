export interface IProcessingGatewayService {
  start<TRequest, TResponse>(
    data: TRequest,
    token?: string
  ): Promise<TResponse>;

  getBatches<TResponse>(token?: string): Promise<TResponse>;
}