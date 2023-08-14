import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Municipio from '../typeorm/entities/Municipio';
import MunicipioRepository from '../typeorm/repositories/MunicipioRepository';
import UFRepository from '@modules/uf/typeorm/repositories/UFRepository';
import ConverterString from '@shared/validator/ConverterString';
import BuscarMunicipiosIbge from '@shared/axios/BuscarMunicipios';
import NotFoundError from '@shared/errors/exceptions/NotFoundError';
import StatusDesativadoError from '@shared/errors/exceptions/StatusDesativadoError';
import AlteracaoMunicipioStatusService from './AlteracaoMunicipioStatusService';
import UF from '@modules/uf/typeorm/entities/UF';

interface IRequest {
  codigoMunicipio: number;
  codigoUF: number;
  nome: string;
  status: number;
}

export default class UpdateMunicipioService {
  private municipioRespository = getCustomRepository(MunicipioRepository);
  private ufRespository = getCustomRepository(UFRepository);
  public async execute({
    codigoMunicipio,
    nome,
    status,
    codigoUF
  }: IRequest): Promise<Municipio[]> {
    const municipio = await this.buscaMunicipio(codigoMunicipio);
    const uf = await this.buscaUFeVerificaStatus(codigoUF, municipio);
    const validatorNome = ConverterString.replaceAndToUpperCase(nome);

    await BuscarMunicipiosIbge(uf.sigla, uf.nome, nome);
    await this.verificaNomeMunicipio(validatorNome, uf, municipio);
    await AlteracaoMunicipioStatusService(codigoMunicipio, status);

    municipio.nome = validatorNome;
    municipio.codigoUF = codigoUF;
    municipio.status = status;

    await this.municipioRespository.save(municipio);
    return this.municipioRespository.findByFindOrder();
  }

  private async buscaMunicipio(codigoMunicipio: number): Promise<Municipio> {
    const municipio = await this.municipioRespository.findOne(codigoMunicipio);
    if (!municipio) {
      throw new NotFoundError('Municípo');
    }
    return municipio;
  }
  private async buscaUFeVerificaStatus(
    codigoUF: number,
    municipio: Municipio
  ): Promise<UF> {
    const uf = await this.ufRespository.findOne(codigoUF);
    if (!uf) {
      throw new NotFoundError('UF');
    }

    if (uf.status === 2 && codigoUF !== municipio.codigoUF) {
      throw new StatusDesativadoError('UF', uf.codigoUF, 'codigoUF');
    }
    return uf;
  }

  private async verificaNomeMunicipio(
    nomeMunicipio: string,
    uf: UF,
    municipio: Municipio
  ) {
    const municipioNomes = await this.municipioRespository.findByNames(
      nomeMunicipio
    );

    if (municipioNomes?.length) {
      const municipioExists = municipioNomes.filter(
        municipios => municipios.codigoUF === uf.codigoUF
      );
      const municipioContens = municipioExists.filter(
        m => m.codigoMunicipio === municipio.codigoMunicipio
      );
      if (municipioContens.length === 0) {
        throw new AppError(
          `Já existe um cadastro de Município com esse nome: ${nomeMunicipio} na UF: ${uf.nome}`,
          409
        );
      }
    }
  }
}
