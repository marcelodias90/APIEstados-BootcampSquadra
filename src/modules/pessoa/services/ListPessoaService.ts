import { getCustomRepository } from 'typeorm';
import Pessoa from '../typeorm/entities/Pessoa';
import PessoaRepository from '../typeorm/repositories/PessoaRepository';

interface IRequest {
  codigoPessoa?: number;
  nome?: string;
  sobrenome?: string;
  login?: string;
  idade?: number;
  status?: number;
}

export default class ListPessoaService {
  public async execute({
    codigoPessoa,
    nome,
    sobrenome,
    login,
    idade,
    status
  }: IRequest): Promise<Pessoa[] | Pessoa> {
    const pessoaRepository = getCustomRepository(PessoaRepository);

    const pessoas = await pessoaRepository.findByFind(
      codigoPessoa,
      nome,
      sobrenome,
      login,
      idade,
      status
    );

    return pessoas;
  }
}
