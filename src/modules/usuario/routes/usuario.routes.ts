import { Router } from 'express';
import UsuariosController from '../controllers/UsuariosController';
import isAuthenticated from '../middlewares/isAuthenticated';

const usuariosRouter = Router();
const usuariosController = new UsuariosController();

usuariosRouter.get('/', isAuthenticated, usuariosController.List);
usuariosRouter.post('/', usuariosController.Create);
usuariosRouter.put(
  '/:codigoUsuario',
  isAuthenticated,
  usuariosController.Update
);
usuariosRouter.delete(
  '/:codigoUsuario',
  isAuthenticated,
  usuariosController.Delete
);

export default usuariosRouter;
