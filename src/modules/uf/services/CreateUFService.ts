import UFRepository from '../typeorm/repositories/UFRepository';
import UF from '../typeorm/entities/UF';
import { getCustomRepository } from 'typeorm';
import ConverterString from '@shared/validator/ConverterString';

import PesquisaUFnoIbge from '@shared/axios/BuscarUFs';
import ExistsError from '@shared/errors/exceptions/ExistsError';

interface IRequest {
  nome: string;
  sigla: string;
  status: number;
}
const ufRespository = getCustomRepository(UFRepository);

export default class CreateUFService {
  public async execute({ nome, sigla, status }: IRequest): Promise<UF[]> {
    const nomeVerificado = await this.validarNome(nome);
    const siglaVerificada = await this.validarSigla(sigla);

    await PesquisaUFnoIbge(nomeVerificado, sigla);

    const uf = ufRespository.create({
      sigla: siglaVerificada,
      nome: nomeVerificado,
      status
    });

    await ufRespository.save(uf);
    const ufs = await ufRespository.findByFindOrder();
    return ufs;
  }

  private async validarNome(nome: string): Promise<string> {
    const nomeConvertido = ConverterString.replaceAndToUpperCase(nome);
    const ufNome = await ufRespository.findByName(nomeConvertido);
    if (ufNome) {
      throw new ExistsError('UF', 'nome', nomeConvertido);
    }
    return nomeConvertido;
  }

  private async validarSigla(sigla: string): Promise<string> {
    const siglaConvertida = ConverterString.replaceAndToUpperCase(sigla);
    const ufSigla = await ufRespository.findBySigla(siglaConvertida);
    if (ufSigla) {
      throw new ExistsError('UF', 'sigla', sigla);
    }
    return siglaConvertida;
  }
}
