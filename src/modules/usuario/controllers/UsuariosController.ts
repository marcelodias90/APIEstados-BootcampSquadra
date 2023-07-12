import { Request, Response } from 'express';
import CreateUsuarioService from '../services/CreateUsuarioService';
import ListUsuarioService from '../services/ListUsuarioService';
import DeleteUsuarioService from '../services/DeleteUsuarioService';
import UpdateUsuarioService from '../services/UpdateUsuarioService';

interface IRequest {
  codigoUsuario?: number;
  nome?: string;
  email?: string;
  senha?: string;
}

export default class UsuariosController {
  public async Create(request: Request, response: Response): Promise<Response> {
    const createUsuario = new CreateUsuarioService();
    const { nome, senha, email } = request.body;

    const usuario = await createUsuario.execute({ nome, senha, email });
    return response.json(usuario);
  }

  public async List(request: Request, response: Response): Promise<Response> {
    const listaUsuario = new ListUsuarioService();
    const { codigoUsuario, nome, email } = request.query as IRequest;

    const usuarios = await listaUsuario.execute({ codigoUsuario, nome, email });
    return response.json(usuarios);
  }

  public async Delete(request: Request, response: Response): Promise<Response> {
    const deleteUsuario = new DeleteUsuarioService();
    const { codigoUsuario } = request.params as IRequest;

    await deleteUsuario.execute({ codigoUsuario: Number(codigoUsuario) });
    return response.json([]);
  }

  public async Update(request: Request, response: Response): Promise<Response> {
    const updateUsuario = new UpdateUsuarioService();
    const { nome, email, senha } = request.body;
    const { codigoUsuario } = request.params;

    const usuario = await updateUsuario.execute({
      codigoUsuario: Number(codigoUsuario),
      nome,
      senha,
      email
    });
    return response.json(usuario);
  }
}
