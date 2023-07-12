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

interface IRequest {
  nome: string;
  codigoUF: number;
  status: number;
}

export default class CreateMunicipioService {
  public async execute({
    nome,
    status,
    codigoUF
  }: IRequest): Promise<Municipio[]> {
    const municipioRespository = getCustomRepository(MunicipioRepository);
    const ufRespository = getCustomRepository(UFRepository);
    ValidarCampo.validaNomeCampo(nome, 'nome');
    ValidarCampo.validarCodigoCampo(codigoUF, 'codigoUF');
    ValidarCampo.validarStatusCampo(status, 'status');

    const uf = await ufRespository.findOne(codigoUF);
    if (!uf) {
      throw new NotFoundError('UF');
    }

    if (uf.status === 2) {
      throw new StatusDesativadoError('UF', uf.codigoUF, 'codigoUF');
    }

    await BuscarMunicipios(uf.sigla, uf.nome, nome);

    const validarNome = ConverterString.replaceAndToUpperCase(nome);
    const municipioNomes = await municipioRespository.findByNames(validarNome);

    if (municipioNomes?.length) {
      const municipioexists = municipioNomes.map(
        municipio => municipio.codigoUF === codigoUF
      );

      if (municipioexists.includes(true)) {
        throw new ExistsError('Municipio', 'nome', nome);
      }
    }
    const municipio = municipioRespository.create({
      nome: validarNome,
      codigoUF: uf.codigoUF,
      status
    });

    await municipioRespository.save(municipio);
    const municipios = await municipioRespository.findByFindOrder();
    return municipios;
  }
}
