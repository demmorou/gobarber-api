import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';

import { User } from '../models/User';

interface IRequest {
  email: string;
  password: string;
}

export class AuthenticateUserService {
  public async execute({ email, password }: IRequest): Promise<{ user: User }> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('invalid credentials');
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error('invalid credentials');
    }

    return { user };
  }
}
