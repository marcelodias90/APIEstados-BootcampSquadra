import Endereco from '@modules/endereco/typeorm/entities/Endereco';
import { getCustomRepository } from 'typeorm';
import PessoaRepository from '../typeorm/repositories/PessoaRepository';
import Pessoa from '../typeorm/entities/Pessoa';
import EnderecoRepository from '@modules/endereco/typeorm/repositories/EnderecoRepository';
import ConverterString from '@shared/validator/ConverterString';
import AppError from '@shared/errors/AppError';
import BairroRepository from '@modules/bairro/typeorm/repositories/BairroRepository';
import BuscarCep from '@shared/axios/BuscarCep';
import NotFoundError from '@shared/errors/exceptions/NotFoundError';
import ExistsError from '@shared/errors/exceptions/ExistsError';
import StatusDesativadoError from '@shared/errors/exceptions/StatusDesativadoError';

interface IRequest {
  codigoPessoa: number;
  nome: string;
  sobrenome: string;
  idade: number;
  login: string;
  senha: string;
  status: number;
  enderecos: Endereco[];
}

export default class UpdatePessoaService {
  public async execute({
    codigoPessoa,
    nome,
    sobrenome,
    idade,
    login,
    senha,
    status,
    enderecos
  }: IRequest): Promise<Pessoa[] | Pessoa> {
    const pessoaRepository = getCustomRepository(PessoaRepository);
    const enderecoRepository = getCustomRepository(EnderecoRepository);
    const bairroRepository = getCustomRepository(BairroRepository);

    const pessoa = await pessoaRepository.findOne(codigoPessoa);
    if (!pessoa) {
      throw new NotFoundError('Pessoa');
    }
    const novologin = ConverterString.replaceAndToUpperCase(login);
    const loginExist = await pessoaRepository.findByLogin(novologin);
    if (loginExist) {
      if (loginExist?.codigoPessoa !== pessoa.codigoPessoa) {
        throw new ExistsError('Pessoa', 'login', login);
      }
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

    const enderecoExistente = await enderecoRepository.findByAllEnderecos(
      enderecos
    );

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

    const codigosEnderecos = enderecoExistente.map(
      endereco => endereco.codigoEndereco
    );
    const checandoEnderecosInexistente = enderecoExistente.filter(
      endereco => !codigosEnderecos.includes(endereco.codigoEndereco)
    );
    if (checandoEnderecosInexistente.length) {
      throw new AppError(
        `codigoEndereco: '${checandoEnderecosInexistente[0].codigoEndereco}' não foi encontrado no Banco de dados.`
      );
    }

    const enderecoCadastrados = await enderecoRepository.findByAll(
      codigoPessoa
    );
    const enderecoHaExcluir = enderecoCadastrados.filter(
      endereco => !codigosEnderecos.includes(endereco.codigoEndereco)
    );

    for (const enderecosExcluir of enderecoHaExcluir) {
      await enderecoRepository.remove(enderecosExcluir);
    }

    for (const endereco of enderecos) {
      if (endereco.codigoEndereco) {
        const enderecoExistente = await enderecoRepository.findOne(
          endereco.codigoEndereco
        );
        if (enderecoExistente) {
          enderecoExistente.codigoBairro = endereco.codigoBairro;
          enderecoExistente.nomeRua = endereco.nomeRua;
          enderecoExistente.numero = endereco.numero;
          enderecoExistente.complemento = endereco.complemento;
          enderecoExistente.cep = endereco.cep;
        }
      } else {
        const novaSequence = await enderecoRepository.query(
          'SELECT SEQUENCE_ENDERECO.NEXTVAL AS NEXTVAL FROM DUAL'
        );
        endereco.codigoEndereco = novaSequence[0].NEXTVAL;
      }
    }

    nome = ConverterString.replaceAndToUpperCase(nome);
    sobrenome = ConverterString.replaceAndToUpperCase(sobrenome);
    pessoa.nome = nome;
    pessoa.sobrenome = sobrenome;
    pessoa.idade = idade;
    pessoa.login = novologin;
    pessoa.senha = senha;
    pessoa.status = status;
    pessoa.enderecos = enderecos;

    await pessoaRepository.save(pessoa);
    const pessoas = await pessoaRepository.findByFind();
    return pessoas;
  }
}
