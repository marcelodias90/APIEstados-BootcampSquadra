import UFRepository from '../typeorm/repositories/UFRepository';
import UF from '../typeorm/entities/UF';
import { getCustomRepository } from 'typeorm';
import ConverterString from '@shared/validator/ConverterString';
import PesquisaUFnoIbge from '@shared/axios/BuscarUFs';
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
  private ufRespository = getCustomRepository(UFRepository);
  public async execute({
    codigoUF,
    nome,
    sigla,
    status
  }: IRequest): Promise<UF[]> {
    const nomeConvertido = ConverterString.replaceAndToUpperCase(nome);
    const siglaConvertida = ConverterString.replaceAndToUpperCase(sigla);

    const uf = await this.verificarUF(
      codigoUF,
      nomeConvertido,
      siglaConvertida
    );

    await PesquisaUFnoIbge(nome, sigla);
    await AlteracaoUFStatusService(codigoUF, status);

    uf.nome = nomeConvertido;
    uf.sigla = siglaConvertida;
    uf.status = status;

    await this.ufRespository.save(uf);
    return await this.ufRespository.findByFindOrder();
  }

  private async verificarUF(
    codigoUF: number,
    nome: string,
    sigla: string
  ): Promise<UF> {
    const uf = await this.ufRespository.findOne(codigoUF);
    if (!uf) {
      throw new NotFoundError('UF');
    }

    const ufNome = await this.ufRespository.findByName(nome);
    if (ufNome && codigoUF !== ufNome.codigoUF) {
      throw new ExistsError('UF', 'nome', nome);
    }
    const ufSigla = await this.ufRespository.findBySigla(sigla);
    if (ufSigla && codigoUF !== ufSigla.codigoUF) {
      throw new ExistsError('UF', 'sigla', sigla);
    }

    return uf;
  }
}
