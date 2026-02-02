export interface IPerformanceGatewayService {

  simulate<TRequest, TResponse>(
    body: TRequest,
    token?: string
  ): Promise<TResponse>;


  createReport<TRequest, TResponse>(
    body: TRequest,
    token?: string
  ): Promise<TResponse>;

  getReports<TResponse>(token?: string): Promise<TResponse>;

  getReportById<TResponse>(
    id: number,
    token?: string
  ): Promise<TResponse>;


  exportPdf(
    id: number,
    token?: string
  ): Promise<{ buffer: Buffer; filename: string }>;


  health<TResponse>(): Promise<TResponse>;
}