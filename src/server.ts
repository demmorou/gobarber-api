import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import routes from './routes';
import uploadConfig from './config/upload';
import { AppError } from './errors/AppError';
import globalErrors from './errors/globalErrors';

import './database';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));

app.use(routes);

app.use(globalErrors);

app.listen(3333, () => {
  console.log('🚀 Server listing on port 3333');
});
