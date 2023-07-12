import { Router } from 'express';
import UFsController from '../controllers/UFsController';
import isAuthenticated from '@modules/usuario/middlewares/isAuthenticated';

const ufsRouter = Router();
const ufsController = new UFsController();

ufsRouter.get('/', isAuthenticated, ufsController.List);
ufsRouter.post('/', isAuthenticated, ufsController.create);
ufsRouter.put('/', isAuthenticated, ufsController.update);
ufsRouter.delete('/:codigoUF', isAuthenticated, ufsController.delete);

export default ufsRouter;
