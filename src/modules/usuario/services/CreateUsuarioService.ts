import { getCustomRepository } from 'typeorm';
import UsuarioRepository from '../typeorm/repositories/UsuarioRepository';
import ConverterString from '@shared/validator/ConverterString';
import Usuario from '../typeorm/entities/Usuario';
import ValidarCampo from '@shared/validator/ValidarCampo';
import { hash } from 'bcryptjs';
import ExistsError from '@shared/errors/exceptions/ExistsError';

interface IRequest {
  nome: string;
  senha: string;
  email: string;
}

export default class CreateUsuarioService {
  public async execute({ nome, senha, email }: IRequest): Promise<Usuario[]> {
    const usuarioRepository = getCustomRepository(UsuarioRepository);

    ValidarCampo.validaNomeCampo(nome, 'nome');
    ValidarCampo.validarCampo(senha, 'senha');
    ValidarCampo.validaEmailCampo(email, 'email');

    const novoEmail = ConverterString.replaceAndToUpperCase(email);
    const novoNome = ConverterString.replaceAndToUpperCase(nome);

    const emailExists = await usuarioRepository.findByEmail(novoEmail);
    if (emailExists) {
      throw new ExistsError('Usuário', 'email', email);
    }

    const criptografaSenha = await hash(senha, 8);

    const usuario = usuarioRepository.create({
      nome: novoNome,
      senha: criptografaSenha,
      email: novoEmail
    });

    await usuarioRepository.save(usuario);
    const usuarios = await usuarioRepository.find();
    return usuarios;
  }
}
