import Bairro from '@modules/bairro/typeorm/entities/Bairro';
import UF from '@modules/uf/typeorm/entities/UF';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn
} from 'typeorm';
import { NextVal, EntityWithSequence } from 'typeorm-sequence-oracle-fixed';

@Entity('TB_MUNICIPIO')
class Municipio extends EntityWithSequence {
  @NextVal('SEQUENCE_MUNICIPIO')
  @PrimaryColumn({ name: 'CODIGO_MUNICIPIO' })
  codigoMunicipio: number;

  @Column({ name: 'CODIGO_UF' })
  codigoUF: number;

  @Column({ name: 'NOME' })
  nome: string;

  @Column({ name: 'STATUS' })
  status: number;

  @OneToOne(() => Bairro, bairro => bairro.municipio)
  bairro: Bairro;

  @ManyToOne(() => UF, uf => uf.municipio)
  @JoinColumn({ name: 'CODIGO_UF' })
  uf: UF[];
}

export default Municipio;
