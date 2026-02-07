export interface IErrorResponse extends Error {
  statusCode: number;
}

export default class ErrorResponse extends Error {
  public statusCode: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode || 400;
  }
}