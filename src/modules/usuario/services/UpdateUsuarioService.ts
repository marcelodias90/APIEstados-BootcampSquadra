import { getCustomRepository } from 'typeorm';
import UsuarioRepository from '../typeorm/repositories/UsuarioRepository';
import ConverterString from '@shared/validator/ConverterString';
import Usuario from '../typeorm/entities/Usuario';
import ValidarCampo from '@shared/validator/ValidarCampo';
import { hash } from 'bcryptjs';
import ExistsError from '@shared/errors/exceptions/ExistsError';
import NotFoundError from '@shared/errors/exceptions/NotFoundError';

interface IRequest {
  codigoUsuario: number;
  nome: string;
  senha: string;
  email: string;
}

export default class UpdateUsuarioService {
  public async execute({
    codigoUsuario,
    nome,
    senha,
    email
  }: IRequest): Promise<Usuario[]> {
    const usuarioRepository = getCustomRepository(UsuarioRepository);

    ValidarCampo.validaNomeCampo(nome, 'nome');
    ValidarCampo.validarCampo(senha, 'senha');
    ValidarCampo.validaEmailCampo(email, 'email');

    const usuario = await usuarioRepository.findOne(codigoUsuario);
    if (!usuario) {
      throw new NotFoundError('Usuário');
    }

    const novoNome = ConverterString.replaceAndToUpperCase(nome);
    const novoEmail = ConverterString.replaceAndToUpperCase(email);

    const emailExists = await usuarioRepository.findByEmail(novoEmail);
    if (emailExists) {
      if (emailExists.codigoUsuario !== codigoUsuario) {
        throw new ExistsError('Usuário', 'email', email);
      }
    }

    const criptografaSenha = await hash(senha, 8);

    usuario.nome = novoNome;
    usuario.senha = criptografaSenha;
    usuario.email = novoEmail;

    await usuarioRepository.save(usuario);
    const usuarios = await usuarioRepository.find();
    return usuarios;
  }
}
