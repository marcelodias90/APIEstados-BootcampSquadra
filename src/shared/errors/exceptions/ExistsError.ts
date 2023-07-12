import AppError from '../AppError';

class ExistsError extends AppError {
  public readonly entidade: string;
  public readonly campo: string;
  public readonly nome: string;

  constructor(entidade: string, campo: string, nome: string) {
    super(
      `Já existe um cadastro de '${entidade}' com esse(a) ${campo}: ${nome}`,
      409
    );
    this.campo = nome;
    this.entidade = entidade;
    this.campo = campo;
  }
}

export default ExistsError;
