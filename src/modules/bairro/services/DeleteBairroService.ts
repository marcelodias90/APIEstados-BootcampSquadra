import { getCustomRepository } from 'typeorm';
import BairroRepository from '../typeorm/repositories/BairroRepository';
import DelecaoCascataBairroService from './DelecaoCascataBairro';
import NotFoundError from '@shared/errors/exceptions/NotFoundError';
import Bairro from '../typeorm/entities/Bairro';

interface IRequest {
  codigoBairro: number;
}

export default class DeleteBairroService {
  public async execute({ codigoBairro }: IRequest): Promise<Bairro[]> {
    const bairroRespository = getCustomRepository(BairroRepository);

    const bairro = await bairroRespository.findOne(codigoBairro);

    if (!bairro) {
      throw new NotFoundError('Bairro');
    }

    await DelecaoCascataBairroService(codigoBairro);

    await bairroRespository.remove(bairro);
    const bairros = await bairroRespository.findByFindOrder();
    return bairros;
  }
}
