export interface IProductionGatewayService {
  getAllPlants<TResponse>(token?: string): Promise<TResponse>;

  plant<TRequest, TResponse>(
    data: TRequest,
    token?: string
  ): Promise<TResponse>;

  adjust<TRequest, TResponse>(
    data: TRequest,
    token?: string
  ): Promise<TResponse>;

  harvest<TRequest, TResponse>(
    data: TRequest,
    token?: string
  ): Promise<TResponse>;
}