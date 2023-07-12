import { getCustomRepository } from 'typeorm';
import Municipio from '../typeorm/entities/Municipio';
import MunicipioRepository from '../typeorm/repositories/MunicipioRepository';

interface IRequest {
  codigoMunicipio?: number;
  codigoUF?: number;
  nome?: string;
  status?: number;
}

export default class ListMunicipioService {
  public async execute({
    codigoMunicipio,
    nome,
    codigoUF,
    status
  }: IRequest): Promise<Municipio[] | Municipio> {
    const municipioRespository = getCustomRepository(MunicipioRepository);

    const municipios = await municipioRespository.findByFind(
      codigoMunicipio,
      nome,
      status,
      codigoUF
    );

    return municipios;
  }
}
