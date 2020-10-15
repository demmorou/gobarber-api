import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
import { AppError } from '../errors/AppError';

import { User } from '../models/User';

interface IRequest {
  email: string;
  password: string;
}

export class AuthenticateUserService {
  public async execute({
    email,
    password,
  }: IRequest): Promise<{ user: User; token: string }> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('invalid credentials', 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('invalid credentials', 401);
    }

    const { expiresIn, secret } = authConfig.jwt;

    const token = sign({}, secret, { subject: user.id, expiresIn });

    return { user, token };
  }
}
