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

export default class CreateUFService {
  private ufRespository = getCustomRepository(UFRepository);

  public async execute({ nome, sigla, status }: IRequest): Promise<UF[]> {
    const nomeVerificado = await this.verificarNome(nome);
    const siglaVerificada = await this.verificaSigla(sigla);

    await PesquisaUFnoIbge(nomeVerificado, sigla);

    const uf = this.ufRespository.create({
      sigla: siglaVerificada,
      nome: nomeVerificado,
      status
    });

    await this.ufRespository.save(uf);
    const ufs = await this.ufRespository.findByFindOrder();
    return ufs;
  }

  private async verificarNome(nome: string): Promise<string> {
    const nomeConvertido = ConverterString.replaceAndToUpperCase(nome);
    const ufNome = await this.ufRespository.findByName(nomeConvertido);
    if (ufNome) {
      throw new ExistsError('UF', 'nome', nomeConvertido);
    }
    return nomeConvertido;
  }

  private async verificaSigla(sigla: string): Promise<string> {
    const siglaConvertida = ConverterString.replaceAndToUpperCase(sigla);
    const ufSigla = await this.ufRespository.findBySigla(siglaConvertida);
    if (ufSigla) {
      throw new ExistsError('UF', 'sigla', sigla);
    }
    return siglaConvertida;
  }
}
