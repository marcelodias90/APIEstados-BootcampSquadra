import { Router } from 'express';
import MunicipiosController from '../controllers/MunicipiosController';
import isAuthenticated from '@modules/usuario/middlewares/isAuthenticated';

const municipiosRouter = Router();
const municipiosController = new MunicipiosController();

municipiosRouter.get('/', isAuthenticated, municipiosController.List);
municipiosRouter.post('/', isAuthenticated, municipiosController.create);
municipiosRouter.put('/', isAuthenticated, municipiosController.update);
municipiosRouter.delete(
  '/:codigoMunicipio',
  isAuthenticated,
  municipiosController.delete
);

export default municipiosRouter;
