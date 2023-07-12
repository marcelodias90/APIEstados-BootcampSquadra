import { getCustomRepository } from 'typeorm';
import Pessoa from '../typeorm/entities/Pessoa';
import PessoaRepository from '../typeorm/repositories/PessoaRepository';
import EnderecoRepository from '@modules/endereco/typeorm/repositories/EnderecoRepository';
import NotFoundError from '@shared/errors/exceptions/NotFoundError';

interface IRequest {
  codigoPessoa: number;
}

export default class DeletePessoaService {
  public async execute({ codigoPessoa }: IRequest): Promise<Pessoa[]> {
    const pessoaRepository = getCustomRepository(PessoaRepository);
    const enderecoRepository = getCustomRepository(EnderecoRepository);

    const pessoa = await pessoaRepository.findOne(codigoPessoa);
    if (!pessoa) {
      throw new NotFoundError('Pessoa');
    }

    const enderecos = await enderecoRepository.findByCodigoPessoa(codigoPessoa);
    if (enderecos.length) {
      for (const endereco of enderecos) {
        await enderecoRepository.remove(endereco);
      }
    }

    await pessoaRepository.remove(pessoa);

    const pessoas = await pessoaRepository.findByFindOrder();
    return pessoas;
  }
}
