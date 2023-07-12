import AppError from '../AppError';

class RuaErradoErorr extends AppError {
  public readonly campo: string;
  public readonly nomeRua: string;

  constructor(nomeRua: string, cep: string) {
    super(`'${nomeRua}' não pertence a esse Cep: '${cep}'`, 404);
    this.campo = cep;
    this.nomeRua = nomeRua;
  }
}

export default RuaErradoErorr;
