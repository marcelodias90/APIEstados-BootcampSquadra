import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import routes from './routes';
import AppError from '@shared/errors/AppError';
import '@shared/typeorm';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        mensagem: error.message,
        status: error.statusCode
      });
    }
    console.log(error);

    return response.status(404).json({
      status: 404,
      mensagem: 'Não foi possível acessar o banco de dados'
    });
  }
);

app.listen(3333, () => {
  console.log('Servidor iniciado na porta 3333!🌎');
});
