import AppError from '../AppError';

class StatusDesativadoError extends AppError {
  public readonly entidade: string;
  public readonly codigo: number;
  public readonly campo: string;

  constructor(entidade: string, codigo: number, campo: string) {
    super(
      `${entidade} do ${campo}:'${codigo}' está Desativado, precisa informar uma ${entidade} Ativado(a).`,
      400
    );
    this.entidade = entidade;
    this.codigo = codigo;
    this.campo = campo;
  }
}

export default StatusDesativadoError;
