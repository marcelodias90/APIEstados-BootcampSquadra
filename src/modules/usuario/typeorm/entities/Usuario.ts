import { Column, Entity, PrimaryColumn } from 'typeorm';
import { EntityWithSequence, NextVal } from 'typeorm-sequence-oracle-fixed';

@Entity('USUARIO')
export default class Usuario extends EntityWithSequence {
  @NextVal('SEQUENCE_USUARIO')
  @PrimaryColumn({ name: 'CODIGOUSUARIO' })
  codigoUsuario: number;

  @Column({ name: 'NOME' })
  nome: string;

  @Column({ name: 'SENHA' })
  senha: string;

  @Column({ name: 'EMAIL' })
  email: string;
}
