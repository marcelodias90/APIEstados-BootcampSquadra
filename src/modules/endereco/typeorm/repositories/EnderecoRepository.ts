import { EntityRepository, In, Repository } from 'typeorm';
import Endereco from '../entities/Endereco';
import AppError from '@shared/errors/AppError';

@EntityRepository(Endereco)
export default class EnderecoRepository extends Repository<Endereco> {
  public async findByPessoa(
    codigoPessoa: number
  ): Promise<Endereco | undefined> {
    const endereco = await this.findOne(codigoPessoa);
    return endereco;
  }

  public async findByCodigoPessoa(codigoPessoa: number): Promise<Endereco[]> {
    const enderecos = await this.find({
      where: {
        codigoPessoa
      }
    });
    return enderecos;
  }

  public async findByAllEnderecos(enderecos: Endereco[]): Promise<Endereco[]> {
    const temCodigo = enderecos.filter(endereco => endereco.codigoEndereco);

    for (const endereco of temCodigo) {
      const enderecoVerificado = await this.findOne({
        where: {
          codigoEndereco: endereco.codigoEndereco
        }
      });
      if (!enderecoVerificado) {
        throw new AppError(
          `Endereço do codigo: '${endereco.codigoEndereco}' não existe no banco de dados.`,
          404
        );
      }
      if (enderecoVerificado) {
        if (enderecoVerificado.codigoPessoa !== endereco.codigoPessoa) {
          throw new AppError(
            `Endereço do codigo: '${endereco.codigoEndereco}' está cadastrado com outra Pessoa.`,
            409
          );
        }
      }
    }
    return temCodigo;
  }

  public async findByAll(codigoPessoa: number): Promise<Endereco[]> {
    const existsEnderecos = await this.find({
      where: {
        codigoPessoa: codigoPessoa
      }
    });
    return existsEnderecos;
  }

  public async findByCodigoBairro(codigoBairro: number): Promise<Endereco[]> {
    const existsEnderecos = await this.find({
      where: {
        codigoBairro
      }
    });
    return existsEnderecos;
  }
}
