import { EntityRepository, Repository } from 'typeorm';
import Municipio from '../entities/Municipio';
import ConverterString from '@shared/validator/ConverterString';
import ValidarCampo from '@shared/validator/ValidarCampo';

@EntityRepository(Municipio)
export default class MunicipioRepository extends Repository<Municipio> {
  public async findByName(nome: string): Promise<Municipio | undefined> {
    const municipio = await this.findOne({
      where: {
        nome
      }
    });
    return municipio;
  }
  public async findByNames(nome: string): Promise<Municipio[] | undefined> {
    const municipios = await this.find({
      where: {
        nome
      }
    });
    return municipios;
  }

  public async findByCodigoUF(codigoUF: number): Promise<Municipio[]> {
    const municipios = await this.find({
      where: {
        codigoUF
      }
    });
    return municipios;
  }

  public async findByFindOrder(): Promise<Municipio[]> {
    const municipios = await this.find({
      order: {
        codigoMunicipio: 'ASC'
      }
    });
    return municipios;
  }

  public async findByFind(
    codigoMunicipio?: number,
    nome?: string,
    status?: number,
    codigoUF?: number
  ): Promise<Municipio[] | Municipio> {
    const lista = this.createQueryBuilder('municipio');
    let condicoes = false;

    if (codigoMunicipio) {
      ValidarCampo.validarCodigoCampo(codigoMunicipio, 'codigoMunicipio');
      lista.andWhere('municipio.codigoMunicipio = :codigoMunicipio', {
        codigoMunicipio
      });
      condicoes = true;
    }
    if (nome) {
      ValidarCampo.validaNomeCampo(nome, 'nome');
      nome = ConverterString.replaceAndToUpperCase(nome);
      lista.andWhere('municipio.nome = :nome', { nome });
    }
    if (status !== undefined && !Number.isNaN(status)) {
      ValidarCampo.validarStatusCampo(status, 'status');
      lista.andWhere('municipio.status = :status', { status });
    }
    if (codigoUF !== undefined && !Number.isNaN(codigoUF)) {
      ValidarCampo.validarCodigoCampo(codigoUF, 'codigoUF');
      lista.andWhere('municipio.codigoUF = :codigoUF', { codigoUF });
    }

    if (condicoes) {
      const municipio = await lista.getOne();
      return municipio ? municipio : [];
    }
    const municipios = await lista
      .orderBy('municipio.codigoMunicipio', 'ASC')
      .getMany();
    return municipios;
  }
}
