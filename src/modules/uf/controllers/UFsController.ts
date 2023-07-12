import { Request, Response } from 'express';
import ListUFService from '../services/ListUFService';
import CreateUFService from '../services/CreateUFService';
import UpdateUFService from '../services/UpdateUFService';
import DeleteUFService from '../services/DeleteUFService';
import ValidarCampo from '@shared/validator/ValidarCampo';

interface ListRequest {
  codigoUF?: number;
  nome?: string;
  sigla?: string;
  status?: number;
}
interface updateRequest {
  codigoUF: number;
  nome: string;
  sigla: string;
  status: number;
}

export default class UFsController {
  public async List(request: Request, response: Response): Promise<Response> {
    const { nome, sigla, codigoUF, status } = request.query as ListRequest;

    const listUFs = new ListUFService();

    const ufs = await listUFs.execute({
      codigoUF,
      nome,
      sigla,
      status
    });
    return response.json(ufs);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { status, nome, sigla } = request.body;

    ValidarCampo.validaNomeCampo(nome, 'nome');
    ValidarCampo.validaSiglaCampo(sigla, 'sigla');
    ValidarCampo.validarStatusCampo(status, 'status');

    const createUF = new CreateUFService();

    const uf = await createUF.execute({
      sigla,
      nome,
      status
    });
    return response.json(uf);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { codigoUF, nome, sigla, status } = request.body as updateRequest;

    ValidarCampo.validarCodigoCampo(codigoUF, 'codigoUF');
    ValidarCampo.validaNomeCampo(nome, 'nome');
    ValidarCampo.validaSiglaCampo(sigla, 'sigla');
    ValidarCampo.validarStatusCampo(status, 'status');

    const updateUF = new UpdateUFService();

    const uf = await updateUF.execute({
      codigoUF,
      nome,
      sigla,
      status
    });
    return response.json(uf);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { codigoUF } = request.params;
    const deleteUF = new DeleteUFService();

    const ufs = await deleteUF.execute({ codigoUF: Number(codigoUF) });

    return response.json(ufs);
  }
}
