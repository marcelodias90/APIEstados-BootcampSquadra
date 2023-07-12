import { getCustomRepository } from 'typeorm';
import UFRepository from '../typeorm/repositories/UFRepository';
import DelecaoCascataUFService from './DelecaoCascataUFService';
import UF from '../typeorm/entities/UF';
import NotFoundError from '@shared/errors/exceptions/NotFoundError';

interface IRequest {
  codigoUF: number;
}

export default class DeleteUFService {
  public async execute({ codigoUF }: IRequest): Promise<UF[]> {
    const ufRespository = getCustomRepository(UFRepository);

    const uf = await ufRespository.findOne(codigoUF);

    if (!uf) {
      throw new NotFoundError('UF');
    }

    await DelecaoCascataUFService(codigoUF);

    await ufRespository.remove(uf);

    const ufs = await ufRespository.findByFindOrder();

    return ufs;
  }
}
