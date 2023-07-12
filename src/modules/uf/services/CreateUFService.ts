import UFRepository from '../typeorm/repositories/UFRepository';
import UF from '../typeorm/entities/UF';
import { getCustomRepository } from 'typeorm';
import ConverterString from '@shared/validator/ConverterString';

import BuscarUFs from '@shared/axios/BuscarUFs';
import ExistsError from '@shared/errors/exceptions/ExistsError';

interface IRequest {
  nome: string;
  sigla: string;
  status: number;
}

export default class CreateUFService {
  public async execute({ nome, sigla, status }: IRequest): Promise<UF[]> {
    const ufRespository = getCustomRepository(UFRepository);

    const validarNome = ConverterString.replaceAndToUpperCase(nome);
    const validarSigla = ConverterString.replaceAndToUpperCase(sigla);

    const ufNome = await ufRespository.findByName(validarNome);
    if (ufNome) {
      throw new ExistsError('UF', 'nome', validarNome);
    }
    const ufSigla = await ufRespository.findBySigla(validarSigla);
    if (ufSigla) {
      throw new ExistsError('UF', 'sigla', sigla);
    }
    await BuscarUFs(nome, sigla);

    const uf = ufRespository.create({
      sigla: validarSigla,
      nome: validarNome,
      status
    });

    await ufRespository.save(uf);
    const ufs = await ufRespository.findByFindOrder();
    return ufs;
  }
}
