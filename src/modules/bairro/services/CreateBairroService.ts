import { getCustomRepository } from 'typeorm';
import Bairro from '../typeorm/entities/Bairro';
import BairroRepository from '../typeorm/repositories/BairroRepository';
import MunicipioRepository from '@modules/municipio/typeorm/repositories/MunicipioRepository';
import AppError from '@shared/errors/AppError';
import ValidarCampo from '@shared/validator/ValidarCampo';
import ConverterString from '@shared/validator/ConverterString';
import NotFoundError from '@shared/errors/exceptions/NotFoundError';
import StatusDesativadoError from '@shared/errors/exceptions/StatusDesativadoError';

interface IRequest {
  codigoMunicipio: number;
  nome: string;
  status: number;
}

export default class CreateBairroService {
  public async execute({
    codigoMunicipio,
    nome,
    status
  }: IRequest): Promise<Bairro[]> {
    const bairroRepository = getCustomRepository(BairroRepository);
    const municipioRepository = getCustomRepository(MunicipioRepository);
    ValidarCampo.validaNomeCampo(nome, 'nome');
    ValidarCampo.validarStatusCampo(status, 'status');
    ValidarCampo.validarCodigoCampo(codigoMunicipio, 'codigoMunicipio');

    const municipio = await municipioRepository.findOne(codigoMunicipio);
    if (!municipio) {
      throw new NotFoundError('Município');
    }

    if (municipio.status === 2) {
      throw new StatusDesativadoError(
        'Município',
        municipio.codigoMunicipio,
        'codigoMunicipio'
      );
    }

    const validarNome = ConverterString.replaceAndToUpperCase(nome);
    const bairroNomes = await bairroRepository.findByNames(validarNome);

    if (bairroNomes?.length) {
      const bairroExists = bairroNomes.map(
        bairro => bairro.codigoMunicipio === codigoMunicipio
      );

      if (bairroExists.includes(true)) {
        throw new AppError(
          `Já existe um cadastro de Bairro com esse nome: ${validarNome} no Município: ${municipio.nome}`,
          409
        );
      }
    }

    const bairro = bairroRepository.create({
      nome: validarNome,
      codigoMunicipio,
      status
    });

    await bairroRepository.save(bairro);
    const bairros = await bairroRepository.find();
    return bairros;
  }
}
