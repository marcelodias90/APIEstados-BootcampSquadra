import Endereco from '@modules/endereco/typeorm/entities/Endereco';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { EntityWithSequence, NextVal } from 'typeorm-sequence-oracle-fixed';

@Entity('TB_PESSOA')
class Pessoa extends EntityWithSequence {
  @NextVal('SEQUENCE_PESSOA')
  @PrimaryColumn({ name: 'CODIGO_PESSOA' })
  codigoPessoa: number;

  @Column({ name: 'NOME' })
  nome: string;

  @Column({ name: 'SOBRENOME' })
  sobrenome: string;

  @Column({ name: 'IDADE' })
  idade: number;

  @Column({ name: 'LOGIN' })
  login: string;

  @Column({ name: 'SENHA' })
  senha: string;

  @Column({ name: 'STATUS' })
  status: number;

  @OneToMany(() => Endereco, enderecos => enderecos.pessoas, {
    cascade: true
  })
  enderecos: Endereco[];
}

export default Pessoa;
