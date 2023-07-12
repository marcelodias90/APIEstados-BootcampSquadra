import { getCustomRepository } from 'typeorm';
import UsuarioRepository from '../typeorm/repositories/UsuarioRepository';
import NotFoundError from '@shared/errors/exceptions/NotFoundError';

interface IRequest {
  codigoUsuario: number;
}

export default class DeleteUsuarioService {
  public async execute({ codigoUsuario }: IRequest): Promise<void> {
    const usuarioRepository = getCustomRepository(UsuarioRepository);

    const usuario = await usuarioRepository.findOne(codigoUsuario);
    if (!usuario) {
      throw new NotFoundError('Usuário');
    }

    await usuarioRepository.remove(usuario);
  }
}
