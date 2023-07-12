import { getCustomRepository } from 'typeorm';
import UsuarioRepository from '../typeorm/repositories/UsuarioRepository';
import Usuario from '../typeorm/entities/Usuario';

interface IRequest {
  codigoUsuario?: number;
  nome?: string;
  email?: string;
}

export default class ListUsuarioService {
  public async execute({
    codigoUsuario,
    nome,
    email
  }: IRequest): Promise<Usuario | Usuario[]> {
    const usuarioRepository = getCustomRepository(UsuarioRepository);

    const usuarios = await usuarioRepository.findByFind(
      codigoUsuario,
      nome,
      email
    );

    return usuarios;
  }
}
