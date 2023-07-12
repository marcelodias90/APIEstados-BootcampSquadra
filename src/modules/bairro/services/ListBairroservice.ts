import { getCustomRepository } from 'typeorm';
import Bairro from '../typeorm/entities/Bairro';
import BairroRepository from '../typeorm/repositories/BairroRepository';

interface IRequest {
  codigoBairro?: number;
  nome?: string;
  status?: number;
  codigoMunicipio?: number;
}

export default class ListBairroService {
  public async execute({
    codigoBairro,
    nome,
    status,
    codigoMunicipio
  }: IRequest): Promise<Bairro[] | Bairro> {
    const bairroRepository = getCustomRepository(BairroRepository);

    const bairros = await bairroRepository.findByFind(
      codigoBairro,
      nome,
      status,
      codigoMunicipio
    );

    return bairros;
  }
}
