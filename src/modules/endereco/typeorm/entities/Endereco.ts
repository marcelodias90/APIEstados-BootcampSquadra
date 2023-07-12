import Bairro from '@modules/bairro/typeorm/entities/Bairro';
import Pessoa from '@modules/pessoa/typeorm/entities/Pessoa';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EntityWithSequence, NextVal } from 'typeorm-sequence-oracle-fixed';

@Entity('TB_ENDERECO')
class Endereco extends EntityWithSequence {
  @NextVal('SEQUENCE_ENDERECO')
  @PrimaryColumn({ name: 'CODIGO_ENDERECO' })
  codigoEndereco: number;

  @Column({ name: 'CODIGO_PESSOA' })
  codigoPessoa: number;

  @Column({ name: 'CODIGO_BAIRRO' })
  codigoBairro: number;

  @Column({ name: 'NOMERUA' })
  nomeRua: string;

  @Column({ name: 'NUMERO' })
  numero: string;

  @Column({ name: 'COMPLEMENTO' })
  complemento: string;

  @Column({ name: 'CEP' })
  cep: string;

  @ManyToOne(() => Pessoa, pessoas => pessoas.enderecos)
  @JoinColumn({ name: 'CODIGO_PESSOA' })
  pessoas: Pessoa;

  @ManyToOne(() => Bairro, bairros => bairros.endereco, {
    eager: true
  })
  @JoinColumn({ name: 'CODIGO_BAIRRO' })
  bairro: Bairro;
}

export default Endereco;
