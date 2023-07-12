import { Request, Response } from 'express';
import ListBairroService from '../services/ListBairroservice';
import CreateBairroService from '../services/CreateBairroService';
import UpdateBairroService from '../services/UpdateBairroService';
import DeleteBairroService from '../services/DeleteBairroService';

interface ListRequest {
  codigoBairro?: number;
  nome?: string;
  status?: number;
  codigoMunicipio?: number;
}

export default class BairrosController {
  public async List(request: Request, response: Response): Promise<Response> {
    const { codigoBairro, codigoMunicipio, nome, status } =
      request.query as ListRequest;
    const listBairros = new ListBairroService();

    const bairros = await listBairros.execute({
      codigoBairro,
      nome,
      status,
      codigoMunicipio
    });
    return response.json(bairros);
  }

  public async Create(request: Request, response: Response): Promise<Response> {
    const { codigoMunicipio, nome, status } = request.body;
    const createBairro = new CreateBairroService();

    const bairro = await createBairro.execute({
      codigoMunicipio,
      nome,
      status
    });
    return response.json(bairro);
  }

  public async Update(request: Request, response: Response): Promise<Response> {
    const { codigoBairro, codigoMunicipio, nome, status } = request.body;
    const updateBairro = new UpdateBairroService();

    const bairro = await updateBairro.execute({
      codigoBairro,
      codigoMunicipio,
      nome,
      status
    });
    return response.json(bairro);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { codigoBairro } = request.params;
    const deleteBairro = new DeleteBairroService();

    const bairros = await deleteBairro.execute({
      codigoBairro: Number(codigoBairro)
    });
    return response.json(bairros);
  }
}
