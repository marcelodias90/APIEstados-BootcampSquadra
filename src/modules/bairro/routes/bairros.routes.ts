import { Router } from 'express';
import BairrosController from '../controllers/BairrosController';
import isAuthenticated from '@modules/usuario/middlewares/isAuthenticated';

const bairrosRouter = Router();
const bairrosController = new BairrosController();

bairrosRouter.get('/', isAuthenticated, bairrosController.List);
bairrosRouter.post('/', isAuthenticated, bairrosController.Create);
bairrosRouter.put('/', isAuthenticated, bairrosController.Update);
bairrosRouter.delete(
  '/:codigoBairro',
  isAuthenticated,
  bairrosController.delete
);

export default bairrosRouter;
