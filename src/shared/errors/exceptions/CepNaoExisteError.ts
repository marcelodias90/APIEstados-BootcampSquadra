import AppError from '../AppError';

class CepNaoExisteError extends AppError {
  public readonly campo: string;
  public readonly codigoBairro: number;

  constructor(entidade: string, codigoBairro: number) {
    super(
      `'${entidade}' que foi enviado com o codigoBairro: '${codigoBairro}' não existe ou está Inativo.`,
      404
    );
    this.campo = entidade;
    this.codigoBairro = codigoBairro;
  }
}

export default CepNaoExisteError;
