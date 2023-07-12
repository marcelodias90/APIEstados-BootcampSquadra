import { Repository, EntityRepository } from 'typeorm';
import Usuario from '../entities/Usuario';
import ConverterString from '@shared/validator/ConverterString';
import ValidarCampo from '@shared/validator/ValidarCampo';

@EntityRepository(Usuario)
export default class UsuarioRepository extends Repository<Usuario> {
  public async findByEmail(email: string): Promise<Usuario | undefined> {
    const usuario = await this.findOne({
      where: {
        email
      }
    });
    return usuario;
  }

  public async findByFind(
    codigoUsuario?: number,
    nome?: string,
    email?: string
  ): Promise<Usuario[] | Usuario> {
    const Lista = this.createQueryBuilder('usuario');

    let condicoes = false;

    if (codigoUsuario) {
      ValidarCampo.validarCodigoCampo(codigoUsuario, 'codigoUsuario');
      Lista.andWhere('usuario.codigoUsuario = :codigoUsuario', {
        codigoUsuario
      });
      condicoes = true;
    }
    if (nome) {
      ValidarCampo.validaNomeCampo(nome, 'nome');
      nome = ConverterString.replaceAndToUpperCase(nome);
      Lista.andWhere('usuario.nome = :nome', { nome });
    }
    if (email) {
      ValidarCampo.validaEmailCampo(email, 'email');
      email = ConverterString.replaceAndToUpperCase(email);
      Lista.andWhere('usuario.email = :email', { email });
      condicoes = true;
    }

    if (condicoes) {
      const usuario = await Lista.getOne();
      return usuario ? usuario : [];
    }
    const usuarios = await Lista.orderBy(
      'usuario.codigoUsuario',
      'ASC'
    ).getMany();

    return usuarios;
  }
}
