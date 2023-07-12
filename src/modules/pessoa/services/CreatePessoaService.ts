import Endereco from '@modules/endereco/typeorm/entities/Endereco';
import { getCustomRepository } from 'typeorm';
import PessoaRepository from '../typeorm/repositories/PessoaRepository';
import Pessoa from '../typeorm/entities/Pessoa';
import ConverterString from '@shared/validator/ConverterString';
import BairroRepository from '@modules/bairro/typeorm/repositories/BairroRepository';
import AppError from '@shared/errors/AppError';
import BuscarCep from '@shared/axios/BuscarCep';
import ExistsError from '@shared/errors/exceptions/ExistsError';
import StatusDesativadoError from '@shared/errors/exceptions/StatusDesativadoError';

interface IRequest {
  nome: string;
  sobrenome: string;
  idade: number;
  login: string;
  senha: string;
  status: number;
  enderecos: Endereco[];
}

export default class CreatePessoaService {
  public async execute({
    nome,
    sobrenome,
    idade,
    login,
    senha,
    status,
    enderecos
  }: IRequest): Promise<Pessoa[] | Pessoa> {
    const pessoaRepository = getCustomRepository(PessoaRepository);
    const bairroRepository = getCustomRepository(BairroRepository);

    nome = ConverterString.replaceAndToUpperCase(nome);
    sobrenome = ConverterString.replaceAndToUpperCase(sobrenome);
    const novologin = ConverterString.replaceAndToUpperCase(login);

    const loginExist = await pessoaRepository.findByLogin(novologin);
    if (loginExist) {
      throw new ExistsError('Pessoa', 'login', login);
    }
    const bairrosExistentes = await bairroRepository.findByAllBairros(
      enderecos
    );
    const codigosBairros = bairrosExistentes.map(bairro => bairro.codigoBairro);
    const checandoBairrosInexistente = enderecos.filter(
      endereco => !codigosBairros.includes(endereco.codigoBairro)
    );
    if (checandoBairrosInexistente.length) {
      throw new AppError(
        `codigoBairro: '${checandoBairrosInexistente[0].codigoBairro}' não foi encontrado no Banco de dados.'`
      );
    }
    for (const endereco of enderecos) {
      const bairro = await bairroRepository.findOne(endereco.codigoBairro);
      if (bairro?.status === 2) {
        throw new StatusDesativadoError(
          'Bairro',
          bairro.codigoBairro,
          'codigoBairro'
        );
      }
    }

    await BuscarCep(enderecos);

    const pessoa = pessoaRepository.create({
      nome,
      sobrenome,
      idade,
      login: novologin,
      senha,
      status,
      enderecos
    });

    await pessoaRepository.save(pessoa);
    const pessoas = await pessoaRepository.findByFind();
    return pessoas;
  }
}
