import { Request, Response } from 'express';
import ListMunicipioService from '../services/ListMunicipioService';
import CreateMunicipioService from '../services/CreateMunicipioService';
import UpdateMunicipioService from '../services/UpdateMunicipioService';
import DeleteMunicipioService from '../services/DeleteMunicipioService';
import ValidarCampo from '@shared/validator/ValidarCampo';

interface ListRequest {
  codigoMunicipio?: number;
  nome?: string;
  status?: number;
  codigoUF?: number;
}

export default class MunicipiosController {
  public async List(request: Request, response: Response): Promise<Response> {
    const { nome, codigoMunicipio, codigoUF, status } =
      request.query as ListRequest;
    const listMunicipios = new ListMunicipioService();

    const municipios = await listMunicipios.execute({
      codigoMunicipio,
      nome,
      status,
      codigoUF
    });
    return response.json(municipios);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { status, nome, codigoUF } = request.body;
    const createMunicipio = new CreateMunicipioService();

    const municipio = await createMunicipio.execute({
      nome,
      codigoUF,
      status
    });
    return response.json(municipio);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { codigoMunicipio, nome, status, codigoUF } = request.body;

    ValidarCampo.validarCodigoCampo(codigoMunicipio, 'codigoMunicipio');
    ValidarCampo.validaNomeCampo(nome, 'nome');
    ValidarCampo.validarStatusCampo(status, 'status');
    ValidarCampo.validarCodigoCampo(codigoUF, 'codigoUF');

    const updateMunicipio = new UpdateMunicipioService();

    const municipio = await updateMunicipio.execute({
      codigoMunicipio: Number(codigoMunicipio),
      codigoUF,
      nome,
      status
    });
    return response.json(municipio);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { codigoMunicipio } = request.params;
    const deleteMunicipio = new DeleteMunicipioService();

    const municipios = await deleteMunicipio.execute({
      codigoMunicipio: Number(codigoMunicipio)
    });

    return response.json(municipios);
  }
}
