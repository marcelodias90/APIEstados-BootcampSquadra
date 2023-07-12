import { EntityRepository, In, Repository } from 'typeorm';
import Bairro from '../entities/Bairro';
import ConverterString from '@shared/validator/ConverterString';
import ValidarCampo from '@shared/validator/ValidarCampo';
import Endereco from '@modules/endereco/typeorm/entities/Endereco';

@EntityRepository(Bairro)
export default class BairroRepository extends Repository<Bairro> {
  public async findByNames(nome: string): Promise<Bairro[]> {
    const bairros = await this.find({
      where: {
        nome
      }
    });
    return bairros;
  }

  public async findByCodigoMunicipio(
    codigoMunicipio: number
  ): Promise<Bairro[]> {
    const bairros = await this.find({
      where: {
        codigoMunicipio
      }
    });
    return bairros;
  }

  public async findByFindOrder(): Promise<Bairro[]> {
    const bairros = await this.find({
      order: {
        codigoBairro: 'ASC'
      }
    });
    return bairros;
  }

  public async findByAllBairros(enderecos: Endereco[]): Promise<Bairro[]> {
    const codigosBairros = enderecos.map(endereco => endereco.codigoBairro);
    const bairrosExistentes = await this.find({
      where: {
        codigoBairro: In(codigosBairros)
      }
    });
    return bairrosExistentes;
  }

  public async findByFind(
    codigoBairro?: number,
    nome?: string,
    status?: number,
    codigoMunicipio?: number
  ): Promise<Bairro[] | Bairro> {
    const Lista = this.createQueryBuilder('bairro');
    let condicoes = false;

    if (codigoBairro) {
      ValidarCampo.validarCodigoCampo(codigoBairro, 'codigoBairro');
      Lista.andWhere('bairro.codigoBairro = :codigoBairro', { codigoBairro });
      condicoes = true;
    }
    if (nome) {
      ValidarCampo.validaNomeCampo(nome, 'nome');
      nome = ConverterString.replaceAndToUpperCase(nome);
      Lista.andWhere('bairro.nome = :nome', { nome });
    }
    if (status !== undefined && !Number.isNaN(status)) {
      ValidarCampo.validarStatusCampo(status, 'status');
      Lista.andWhere('bairro.status = :status', { status });
    }
    if (codigoMunicipio !== undefined && !Number.isNaN(codigoMunicipio)) {
      ValidarCampo.validarCodigoCampo(codigoMunicipio, 'codigoMunicipio');
      Lista.andWhere('bairro.codigoMunicipio = :codigoMunicipio', {
        codigoMunicipio
      });
    }
    if (condicoes) {
      const bairro = await Lista.getOne();
      return bairro ? bairro : [];
    }
    const bairros = await Lista.orderBy('bairro.codigoBairro', 'ASC').getMany();
    return bairros;
  }
}
