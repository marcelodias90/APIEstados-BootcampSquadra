import { Router } from 'express';
import ufsRouter from '@modules/uf/routes/ufs.routes';
import municipiosRouter from '@modules/municipio/routes/municipios.routes';
import bairrosRouter from '@modules/bairro/routes/bairros.routes';
import pessoasRouter from '@modules/pessoa/routes/pessoas.routes';
import usuariosRouter from '@modules/usuario/routes/usuario.routes';
import sessionsRouter from '@modules/uf/routes/sessions.routes';

const routes = Router();

routes.use('/uf', ufsRouter);
routes.use('/municipio', municipiosRouter);
routes.use('/bairro', bairrosRouter);
routes.use('/pessoa', pessoasRouter);
routes.use('/usuario', usuariosRouter);
routes.use('/sessao', sessionsRouter);

export default routes;
