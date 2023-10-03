export class ApiError extends Error {
  status: number;
  message: string;

  constructor({message, status}: {message: string; status: number}) {
    super();
    this.message = message;
    this.status = status;
  }
}
