import { EntityRepository, Repository } from 'typeorm';
import Pessoa from '../entities/Pessoa';
import ConverterString from '@shared/validator/ConverterString';
import ValidarCampo from '@shared/validator/ValidarCampo';

@EntityRepository(Pessoa)
export default class PessoaRepository extends Repository<Pessoa> {
  public async findByLogin(login: string): Promise<Pessoa | undefined> {
    const pessoa = await this.findOne({
      where: {
        login
      }
    });
    return pessoa;
  }
  public async findByCodigoPessoa(
    codigoPessoa: number
  ): Promise<Pessoa | undefined> {
    const pessoa = await this.findOne(codigoPessoa);
    return pessoa;
  }

  public async findByFindOrder(): Promise<Pessoa[]> {
    const pessoas = await this.find({
      order: {
        codigoPessoa: 'ASC'
      }
    });
    return pessoas;
  }

  public async findByFind(
    codigoPessoa?: number,
    nome?: string,
    sobrenome?: string,
    login?: string,
    idade?: number,
    status?: number
  ): Promise<Pessoa | Pessoa[]> {
    const Lista = this.createQueryBuilder('pessoa');

    let condicoes = false;

    if (codigoPessoa && !Number.isNaN(codigoPessoa)) {
      ValidarCampo.validarCodigoCampo(codigoPessoa, 'codigoPessoa');
      Lista.andWhere('pessoa.codigoPessoa = :codigoPessoa', {
        codigoPessoa
      });
      condicoes = true;
    }
    if (nome) {
      ValidarCampo.validaNomeCampo(nome, 'nome');
      nome = ConverterString.replaceAndToUpperCase(nome);
      Lista.andWhere('pessoa.nome = :nome', { nome });
      condicoes = false;
    }
    if (sobrenome) {
      ValidarCampo.validaSobreNomeCampo(sobrenome, 'sobrenome');
      sobrenome = ConverterString.replaceAndToUpperCase(sobrenome);
      Lista.andWhere('pessoa.sobrenome = :sobrenome', { sobrenome });
      condicoes = false;
    }
    if (login) {
      ValidarCampo.validaLoginCampo(login, 'login');
      login = ConverterString.replaceAndToUpperCase(login);
      Lista.andWhere('pessoa.login = :login', { login });
      condicoes = false;
    }
    if (idade !== undefined && !Number.isNaN(idade)) {
      ValidarCampo.validaIdadeCampo(idade, 'idade');
      Lista.andWhere('pessoa.idade = :idade', { idade });
      condicoes = false;
    }
    if (status !== undefined && !Number.isNaN(status)) {
      ValidarCampo.validarStatusCampo(status, 'status');
      Lista.andWhere('pessoa.status = :status', { status });
      condicoes = false;
    }

    if (condicoes) {
      const pessoa = await Lista.leftJoinAndSelect(
        'pessoa.enderecos',
        'endereco'
      )
        .leftJoinAndSelect('endereco.bairro', 'bairro')
        .leftJoinAndSelect('bairro.municipio', 'municipio')
        .leftJoinAndSelect('municipio.uf', 'uf')
        .orderBy('endereco.codigoEndereco', 'ASC')
        .getOne();
      return pessoa ? pessoa : [];
    }
    const pessoas = await Lista.orderBy('pessoa.codigoPessoa', 'ASC')
      .leftJoinAndSelect(
        'pessoa.enderecos',
        'endereco',
        'endereco.codigoEndereco IS NULL'
      )
      .getMany();

    return pessoas;
  }
}
