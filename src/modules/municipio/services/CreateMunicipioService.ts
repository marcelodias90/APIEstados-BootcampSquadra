import { getCustomRepository } from 'typeorm';
import MunicipioRepository from '../typeorm/repositories/MunicipioRepository';
import Municipio from '../typeorm/entities/Municipio';
import UFRepository from '@modules/uf/typeorm/repositories/UFRepository';
import ValidarCampo from '@shared/validator/ValidarCampo';
import ConverterString from '@shared/validator/ConverterString';
import BuscarMunicipios from '@shared/axios/BuscarMunicipios';
import ExistsError from '@shared/errors/exceptions/ExistsError';
import NotFoundError from '@shared/errors/exceptions/NotFoundError';
import StatusDesativadoError from '@shared/errors/exceptions/StatusDesativadoError';
import UF from '@modules/uf/typeorm/entities/UF';

interface IRequest {
  nome: string;
  codigoUF: number;
  status: number;
}
const ufRespository = getCustomRepository(UFRepository);
const municipioRespository = getCustomRepository(MunicipioRepository);

export default class CreateMunicipioService {
  public async execute({
    nome,
    status,
    codigoUF
  }: IRequest): Promise<Municipio[]> {
    ValidarCampo.validaNomeCampo(nome, 'nome');
    ValidarCampo.validarCodigoCampo(codigoUF, 'codigoUF');
    ValidarCampo.validarStatusCampo(status, 'status');

    const ufVerificado = await this.buscaUFeVerificaStatus(codigoUF);
    const nomeVerificado = await this.buscaNomeVerificaEConverte(
      nome,
      codigoUF
    );

    await BuscarMunicipios(ufVerificado.sigla, ufVerificado.nome, nome);

    const municipio = municipioRespository.create({
      nome: nomeVerificado,
      codigoUF: ufVerificado.codigoUF,
      status
    });

    await municipioRespository.save(municipio);
    const municipios = await municipioRespository.findByFindOrder();
    return municipios;
  }

  private async buscaUFeVerificaStatus(codigoUF: number): Promise<UF> {
    const uf = await ufRespository.findOne(codigoUF);
    if (!uf) {
      throw new NotFoundError('UF');
    }

    if (uf.status === 2) {
      throw new StatusDesativadoError('UF', uf.codigoUF, 'codigoUF');
    }
    return uf;
  }

  private async buscaNomeVerificaEConverte(
    nome: string,
    codigoUF: number
  ): Promise<string> {
    const nomeConvertido = ConverterString.replaceAndToUpperCase(nome);
    const municipioNomes = await municipioRespository.findByNames(
      nomeConvertido
    );

    if (municipioNomes?.length) {
      const municipioexists = municipioNomes.map(
        municipio => municipio.codigoUF === codigoUF
      );

      if (municipioexists.includes(true)) {
        throw new ExistsError('Municipio', 'nome', nome);
      }
    }
    return nomeConvertido;
  }
}
