import Municipio from '@modules/municipio/typeorm/entities/Municipio';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { NextVal, EntityWithSequence } from 'typeorm-sequence-oracle-fixed';

@Entity('TB_UF')
class UF extends EntityWithSequence {
  @NextVal('SEQUENCE_UF')
  @PrimaryColumn({ name: 'CODIGO_UF' })
  codigoUF: number;

  @Column({ name: 'NOME' })
  nome: string;

  @Column({ name: 'SIGLA' })
  sigla: string;

  @Column({ name: 'STATUS' })
  status: number;

  @OneToMany(() => Municipio, municipio => municipio.uf)
  municipio: Municipio;
}

export default UF;
