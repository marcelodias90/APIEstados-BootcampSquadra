import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Municipio from '../typeorm/entities/Municipio';
import MunicipioRepository from '../typeorm/repositories/MunicipioRepository';
import UFRepository from '@modules/uf/typeorm/repositories/UFRepository';
import ConverterString from '@shared/validator/ConverterString';
import BuscarMunicipios from '@shared/axios/BuscarMunicipios';
import NotFoundError from '@shared/errors/exceptions/NotFoundError';
import StatusDesativadoError from '@shared/errors/exceptions/StatusDesativadoError';
import AlteracaoMunicipioStatusService from './AlteracaoMunicipioStatusService';

interface IRequest {
  codigoMunicipio: number;
  codigoUF: number;
  nome: string;
  status: number;
}

export default class UpdateMunicipioService {
  public async execute({
    codigoMunicipio,
    nome,
    status,
    codigoUF
  }: IRequest): Promise<Municipio[]> {
    const municipioRespository = getCustomRepository(MunicipioRepository);
    const ufRespository = getCustomRepository(UFRepository);

    const municipio = await municipioRespository.findOne(codigoMunicipio);
    if (!municipio) {
      throw new NotFoundError('Municípo');
    }
    const uf = await ufRespository.findOne(codigoUF);
    if (!uf) {
      throw new NotFoundError('UF');
    }

    if (uf.status === 2 && codigoUF !== municipio.codigoUF) {
      throw new StatusDesativadoError('UF', uf.codigoUF, 'codigoUF');
    }

    await BuscarMunicipios(uf.sigla, uf.nome, nome);

    const validatorNome = ConverterString.replaceAndToUpperCase(nome);

    const municipioNomes = await municipioRespository.findByNames(
      validatorNome
    );

    if (municipioNomes?.length) {
      const municipioExists = municipioNomes.filter(
        municipios => municipios.codigoUF === codigoUF
      );
      const municipioContens = municipioExists.filter(
        m => m.codigoMunicipio === municipio.codigoMunicipio
      );
      if (municipioContens.length === 0) {
        throw new AppError(
          `Já existe um cadastro de Município com esse nome: ${validatorNome} na UF: ${uf.nome}`,
          409
        );
      }
    }

    await AlteracaoMunicipioStatusService(codigoMunicipio, status);

    municipio.nome = validatorNome;
    municipio.codigoUF = codigoUF;
    municipio.status = status;

    await municipioRespository.save(municipio);
    return municipioRespository.findByFindOrder();
  }
}
