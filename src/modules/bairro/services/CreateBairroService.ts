import { getCustomRepository } from 'typeorm';
import Bairro from '../typeorm/entities/Bairro';
import BairroRepository from '../typeorm/repositories/BairroRepository';
import MunicipioRepository from '@modules/municipio/typeorm/repositories/MunicipioRepository';
import AppError from '@shared/errors/AppError';
import ValidarCampo from '@shared/validator/ValidarCampo';
import ConverterString from '@shared/validator/ConverterString';
import NotFoundError from '@shared/errors/exceptions/NotFoundError';
import StatusDesativadoError from '@shared/errors/exceptions/StatusDesativadoError';
import Municipio from '@modules/municipio/typeorm/entities/Municipio';

interface IRequest {
  codigoMunicipio: number;
  nome: string;
  status: number;
}

export default class CreateBairroService {
  private bairroRepository = getCustomRepository(BairroRepository);
  private municipioRepository = getCustomRepository(MunicipioRepository);
  public async execute({
    codigoMunicipio,
    nome,
    status
  }: IRequest): Promise<Bairro[]> {
    ValidarCampo.validaNomeCampo(nome, 'nome');
    ValidarCampo.validarStatusCampo(status, 'status');
    ValidarCampo.validarCodigoCampo(codigoMunicipio, 'codigoMunicipio');

    const municipio = await this.buscaMunicipioEVerificaStatus(codigoMunicipio);
    const nomeConvertido = ConverterString.replaceAndToUpperCase(nome);
    await this.verificaNomeBairro(nomeConvertido, municipio);

    const bairro = this.bairroRepository.create({
      nome: nomeConvertido,
      codigoMunicipio,
      status
    });

    await this.bairroRepository.save(bairro);
    const bairros = await this.bairroRepository.find();
    return bairros;
  }

  private async buscaMunicipioEVerificaStatus(
    codigoMunicipio: number
  ): Promise<Municipio> {
    const municipio = await this.municipioRepository.findOne(codigoMunicipio);
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
    return municipio;
  }

  private async verificaNomeBairro(nome: string, municipio: Municipio) {
    const bairroNomes = await this.bairroRepository.findByNames(nome);

    if (bairroNomes?.length) {
      const bairroExists = bairroNomes.map(
        bairro => bairro.codigoMunicipio === municipio.codigoMunicipio
      );

      if (bairroExists.includes(true)) {
        throw new AppError(
          `Já existe um cadastro de Bairro com esse nome: ${nome} no Município: ${municipio.nome}`,
          409
        );
      }
    }
  }
}
