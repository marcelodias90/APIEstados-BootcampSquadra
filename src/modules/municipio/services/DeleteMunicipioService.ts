import { getCustomRepository } from 'typeorm';
import MunicipioRepository from '../typeorm/repositories/MunicipioRepository';
import DelecaoCascataMunicipioService from './DelecaoCascataMunicipioService';
import NotFoundError from '@shared/errors/exceptions/NotFoundError';
import Municipio from '../typeorm/entities/Municipio';

interface IRequest {
  codigoMunicipio: number;
}

export default class DeleteMunicipioService {
  public async execute({ codigoMunicipio }: IRequest): Promise<Municipio[]> {
    const municipioRespository = getCustomRepository(MunicipioRepository);

    const municipio = await municipioRespository.findOne(codigoMunicipio);

    if (!municipio) {
      throw new NotFoundError('Municípo');
    }

    await DelecaoCascataMunicipioService(codigoMunicipio);

    await municipioRespository.remove(municipio);
    const municipios = await municipioRespository.findByFindOrder();
    return municipios;
  }
}
