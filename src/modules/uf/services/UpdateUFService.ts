import UFRepository from '../typeorm/repositories/UFRepository';
import UF from '../typeorm/entities/UF';
import { getCustomRepository } from 'typeorm';
import ConverterString from '@shared/validator/ConverterString';
import BuscarUFs from '@shared/axios/BuscarUFs';
import ExistsError from '@shared/errors/exceptions/ExistsError';
import NotFoundError from '@shared/errors/exceptions/NotFoundError';
import AlteracaoUFStatusService from './AlteracaoUFStatusService';

interface IRequest {
  codigoUF: number;
  nome: string;
  sigla: string;
  status: number;
}

export default class UpdateUFService {
  public async execute({
    codigoUF,
    nome,
    sigla,
    status
  }: IRequest): Promise<UF[]> {
    const ufRespository = getCustomRepository(UFRepository);

    const uf = await ufRespository.findOne(codigoUF);
    if (!uf) {
      throw new NotFoundError('UF');
    }

    const validarNome = ConverterString.replaceAndToUpperCase(nome);
    const validarSigla = ConverterString.replaceAndToUpperCase(sigla);

    const ufNome = await ufRespository.findByName(validarNome);
    if (ufNome && codigoUF !== ufNome.codigoUF) {
      throw new ExistsError('UF', 'nome', nome);
    }
    const ufSigla = await ufRespository.findBySigla(validarSigla);
    if (ufSigla && codigoUF !== ufSigla.codigoUF) {
      throw new ExistsError('UF', 'sigla', sigla);
    }

    await BuscarUFs(nome, sigla);
    await AlteracaoUFStatusService(codigoUF, status);

    uf.nome = validarNome;
    uf.sigla = validarSigla;
    uf.status = status;

    await ufRespository.save(uf);
    return await ufRespository.findByFindOrder();
  }
}
