import { Request, Response } from 'express';
import CreatePessoaService from '../services/CreatePessoaService';
import ListPessoaService from '../services/ListPessoaService';
import UpdatePessoaService from '../services/UpdatePessoaService';
import ValidarCampo from '@shared/validator/ValidarCampo';
import ValidarObjetoEndereco from '@shared/validator/ValidarObjetoEndereco';
import Endereco from '@modules/endereco/typeorm/entities/Endereco';
import DeletePessoaService from '../services/DeletePessoaService';

interface CreateRequest {
  nome: string;
  sobrenome: string;
  login: string;
  senha: string;
  idade: number;
  status: number;
  enderecos: Endereco[];
}
interface ListRequest {
  codigoPessoa?: number;
  nome?: string;
  sobrenome?: string;
  login?: string;
  idade?: number;
  status?: number;
}
interface UpdateRequest {
  codigoPessoa: number;
  nome: string;
  sobrenome: string;
  login: string;
  senha: string;
  idade: number;
  status: number;
  enderecos: Endereco[];
}

export default class PessoasController {
  public async Create(request: Request, response: Response): Promise<Response> {
    const createPessoa = new CreatePessoaService();
    const { nome, sobrenome, idade, login, senha, status, enderecos } =
      request.body as CreateRequest;

    ValidarCampo.validaNomeCampo(nome, 'nome');
    ValidarCampo.validaSobreNomeCampo(sobrenome, 'sobreNome');
    ValidarCampo.validaIdadeCampo(idade, 'idade');
    ValidarCampo.validaLoginCampo(login, 'login');
    ValidarCampo.validarStatusCampo(status, 'status');
    ValidarCampo.validaSenhaCampo(senha, 'senha');
    ValidarCampo.validarCampoObjeto(enderecos, 'enderecos');
    ValidarObjetoEndereco.execute(enderecos);

    const pessoa = await createPessoa.execute({
      nome,
      sobrenome,
      idade,
      login,
      senha,
      status,
      enderecos
    });
    return response.json(pessoa);
  }

  public async List(request: Request, response: Response): Promise<Response> {
    const listaPessoa = new ListPessoaService();
    const { codigoPessoa, nome, sobrenome, login, idade, status } =
      request.query as ListRequest;

    const pessoas = await listaPessoa.execute({
      codigoPessoa,
      nome,
      sobrenome,
      login,
      idade,
      status
    });
    return response.json(pessoas);
  }

  public async Update(request: Request, response: Response): Promise<Response> {
    const updatePessoa = new UpdatePessoaService();
    const {
      codigoPessoa,
      nome,
      sobrenome,
      idade,
      login,
      senha,
      status,
      enderecos
    } = request.body as UpdateRequest;

    ValidarCampo.validarCodigoCampo(codigoPessoa, 'codigoPessoa');
    ValidarCampo.validaNomeCampo(nome, 'nome');
    ValidarCampo.validaSobreNomeCampo(sobrenome, 'sobrenome');
    ValidarCampo.validaIdadeCampo(idade, 'idade');
    ValidarCampo.validaLoginCampo(login, 'login');
    ValidarCampo.validarStatusCampo(status, 'status');
    ValidarCampo.validaSenhaCampo(senha, 'senha');
    ValidarCampo.validarCampoObjeto(enderecos, 'enderecos');
    ValidarObjetoEndereco.execute(enderecos);

    const pessoa = await updatePessoa.execute({
      codigoPessoa,
      nome,
      sobrenome,
      idade,
      login,
      senha,
      status,
      enderecos
    });
    return response.json(pessoa);
  }

  public async Delete(request: Request, response: Response): Promise<Response> {
    const deletaPessoa = new DeletePessoaService();
    const { codigoPessoa } = request.params;

    const pessoas = await deletaPessoa.execute({
      codigoPessoa: Number(codigoPessoa)
    });
    return response.json(pessoas);
  }
}
