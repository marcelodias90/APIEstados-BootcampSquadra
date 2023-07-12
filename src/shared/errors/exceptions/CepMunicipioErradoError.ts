import AppError from '../AppError';

class CepMunicipioErradoError extends AppError {
  public readonly nomeMunicipio: string;
  public readonly cep: string;

  constructor(nomeMunicipio: string, cep: string) {
    super(
      `Cep: '${cep}' não corresponde ao Município: '${nomeMunicipio}'`,
      404
    );
    this.nomeMunicipio = nomeMunicipio;
    this.cep = cep;
  }
}

export default CepMunicipioErradoError;
