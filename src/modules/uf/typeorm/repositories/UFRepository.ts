import { EntityRepository, Repository } from 'typeorm';
import UF from '../entities/UF';
import ConverterString from '@shared/validator/ConverterString';
import ValidarCampo from '@shared/validator/ValidarCampo';

@EntityRepository(UF)
export default class UFRepository extends Repository<UF> {
  public async findByName(nome: string): Promise<UF | undefined> {
    const uf = await this.findOne({
      where: {
        nome
      }
    });
    return uf;
  }

  public async findBySigla(sigla: string): Promise<UF | undefined> {
    const uf = await this.findOne({
      where: {
        sigla
      }
    });
    return uf;
  }
  public async findByFindOrder(): Promise<UF[]> {
    const uf = await this.find({
      order: {
        codigoUF: 'ASC'
      }
    });
    return uf;
  }

  public async findByFind(
    codigoUF?: number,
    nome?: string,
    sigla?: string,
    status?: number
  ): Promise<UF | UF[]> {
    const lista = this.createQueryBuilder('uf');
    let condicoes = false;

    if (codigoUF) {
      ValidarCampo.validarCodigoCampo(codigoUF, 'codigoUF');
      lista.andWhere('uf.codigoUF= :codigoUF', { codigoUF });
      condicoes = true;
    }
    if (nome) {
      ValidarCampo.validaNomeCampo(nome, 'nome');
      nome = ConverterString.replaceAndToUpperCase(nome);
      lista.andWhere('uf.nome = :nome', { nome });
      condicoes = true;
    }
    if (sigla) {
      ValidarCampo.validaSiglaCampo(sigla, 'sigla');
      sigla = ConverterString.replaceAndToUpperCase(sigla);
      lista.andWhere('uf.sigla = :sigla', { sigla });
      condicoes = true;
    }
    if (status) {
      ValidarCampo.validarStatusCampo(status, 'status');
      lista.andWhere('uf.status = :status', { status });
    }

    if (condicoes) {
      const uf = await lista.getOne();
      return uf ? uf : [];
    }

    const ufs = await lista.orderBy('uf.codigoUF', 'ASC').getMany();
    return ufs;
  }
}
