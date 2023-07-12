import { Router } from 'express';
import PessoasController from '../controllers/PessoasController';
import isAuthenticated from '@modules/usuario/middlewares/isAuthenticated';

const pessoasRouter = Router();
const pessoasController = new PessoasController();

pessoasRouter.post('/', isAuthenticated, pessoasController.Create);
pessoasRouter.get('/', isAuthenticated, pessoasController.List);
pessoasRouter.put('/', isAuthenticated, pessoasController.Update);
pessoasRouter.delete(
  '/:codigoPessoa',
  isAuthenticated,
  pessoasController.Delete
);

export default pessoasRouter;
