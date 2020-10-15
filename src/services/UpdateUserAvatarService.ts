import path from 'path';
import fs from 'fs';
import { getRepository } from 'typeorm';

import uploadConfig from '../config/upload';

import { User } from '../models/User';

interface IRequest {
  user_id: string;
  avatar_filename: string;
}

export class UpdateUserAvatarService {
  public async execute({ user_id, avatar_filename }: IRequest): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new Error('only authenticated user can change the avatar');
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatar_filename;

    return usersRepository.save(user);
  }
}
