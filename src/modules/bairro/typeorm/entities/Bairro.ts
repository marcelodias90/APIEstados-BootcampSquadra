import Endereco from '@modules/endereco/typeorm/entities/Endereco';
import Municipio from '@modules/municipio/typeorm/entities/Municipio';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn
} from 'typeorm';
import { NextVal, EntityWithSequence } from 'typeorm-sequence-oracle-fixed';

@Entity('TB_BAIRRO')
class Bairro extends EntityWithSequence {
  @NextVal('SEQUENCE_BAIRRO')
  @PrimaryColumn({ name: 'CODIGO_BAIRRO' })
  codigoBairro: number;

  @Column({ name: 'NOME' })
  nome: string;

  @Column({ name: 'STATUS' })
  status: number;

  @Column({ name: 'CODIGO_MUNICIPIO' })
  codigoMunicipio: number;

  @OneToMany(() => Endereco, endereco => endereco.bairro)
  endereco: Endereco[];

  @OneToOne(() => Municipio, municipio => municipio.bairro)
  @JoinColumn({ name: 'CODIGO_MUNICIPIO' })
  municipio: Municipio;
}
export default Bairro;
