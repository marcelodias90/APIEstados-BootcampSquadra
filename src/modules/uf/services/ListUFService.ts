import { getCustomRepository } from 'typeorm';
import UF from '../typeorm/entities/UF';
import UFRepository from '../typeorm/repositories/UFRepository';

interface IRequest {
  codigoUF?: number;
  nome?: string;
  sigla?: string;
  status?: number;
}

export default class ListUFService {
  public async execute({
    codigoUF,
    nome,
    sigla,
    status
  }: IRequest): Promise<UF[] | UF> {
    const ufRespository = getCustomRepository(UFRepository);

    const ufs = await ufRespository.findByFind(codigoUF, nome, sigla, status);
    return ufs;
  }
}
