import AppError from '../AppError';

class NotFoundError extends AppError {
  public readonly campo: string;

  constructor(entidade: string) {
    super(`'${entidade}' não foi encontrado.`, 404);
    this.campo = entidade;
  }
}

export default NotFoundError;
