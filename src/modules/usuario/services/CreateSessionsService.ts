import { getCustomRepository } from 'typeorm';
import UsuarioRepository from '../typeorm/repositories/UsuarioRepository';
import { compare } from 'bcryptjs';
import AppError from '@shared/errors/AppError';

import auth from '@config/auth';
import { sign } from 'jsonwebtoken';
import ConverterString from '@shared/validator/ConverterString';
import ValidarCampo from '@shared/validator/ValidarCampo';
import NotFoundError from '@shared/errors/exceptions/NotFoundError';

interface IRequest {
  email: string;
  senha: string;
}
interface IUsuario {
  nome: string;
  email: string;
}

interface IResponse {
  usuario: IUsuario;
  token: string;
}

export default class CreateSessionsService {
  public async execute({ email, senha }: IRequest): Promise<IResponse> {
    const usuarioRepository = getCustomRepository(UsuarioRepository);

    ValidarCampo.validaEmailCampo(email, 'email');
    ValidarCampo.validarCampo(senha, 'senha');

    const novoEmail = ConverterString.replaceAndToUpperCase(email);
    const usuarioExists = await usuarioRepository.findByEmail(novoEmail);
    if (!usuarioExists) {
      throw new NotFoundError('Usuário');
    }

    const conferindoSenha = await compare(senha, usuarioExists.senha);
    if (!conferindoSenha) {
      throw new AppError('Senha Incorreta!', 401);
    }

    const token = sign({}, auth.jwt.secret, {
      expiresIn: auth.jwt.expiresIn
    });

    const usuario = {
      nome: usuarioExists.nome,
      email: usuarioExists.email
    };

    return { usuario, token };
  }
}
