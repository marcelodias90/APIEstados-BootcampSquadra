import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Bairro from '../typeorm/entities/Bairro';
import MunicipioRepository from '@modules/municipio/typeorm/repositories/MunicipioRepository';
import BairroRepository from '../typeorm/repositories/BairroRepository';
import ValidarCampo from '@shared/validator/ValidarCampo';
import ConverterString from '@shared/validator/ConverterString';
import NotFoundError from '@shared/errors/exceptions/NotFoundError';
import StatusDesativadoError from '@shared/errors/exceptions/StatusDesativadoError';

interface IRequest {
  codigoBairro: number;
  codigoMunicipio: number;
  nome: string;
  status: number;
}

export default class UpdateBairroService {
  public async execute({
    codigoBairro,
    codigoMunicipio,
    nome,
    status
  }: IRequest): Promise<Bairro[]> {
    const bairroRepository = getCustomRepository(BairroRepository);
    const municipioRespository = getCustomRepository(MunicipioRepository);
    ValidarCampo.validarCampo(nome, 'nome');
    ValidarCampo.validarCodigoCampo(codigoMunicipio, 'codigoMunicípio');
    ValidarCampo.validarCodigoCampo(codigoBairro, 'codigoBairro');
    ValidarCampo.validarStatusCampo(status, 'status');

    const bairro = await bairroRepository.findOne(codigoBairro);
    if (!bairro) {
      throw new NotFoundError('Bairro');
    }
    const municipio = await municipioRespository.findOne(codigoMunicipio);
    if (!municipio) {
      throw new NotFoundError('Município');
    }

    if (municipio.status === 2 && codigoMunicipio !== bairro.codigoMunicipio) {
      throw new StatusDesativadoError(
        'Município',
        municipio.codigoMunicipio,
        'codigoMunicipio'
      );
    }

    const validarNome = ConverterString.replaceAndToUpperCase(nome);
    const bairroNomes = await bairroRepository.findByNames(validarNome);

    if (bairroNomes.length) {
      const bairroExists = bairroNomes.filter(bairros => {
        return bairros.codigoMunicipio === codigoMunicipio;
      });
      const bairroContem = bairroExists.filter(
        b => b.codigoBairro === bairro.codigoBairro
      );
      if (bairroContem.length === 0) {
        throw new AppError(
          `Já existe um cadastro de Bairro com esse nome: ${validarNome} no Município: ${municipio.nome}`,
          409
        );
      }
    }

    bairro.nome = validarNome;
    bairro.codigoMunicipio = municipio.codigoMunicipio;
    bairro.status = status;

    await bairroRepository.save(bairro);
    return bairroRepository.findByFindOrder();
  }
}
