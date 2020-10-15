import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';

import { CreateUserService } from '../services/CreateUserService';
import { UpdateUserAvatarService } from '../services/UpdateUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({ name, email, password });

  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateAvatar = new UpdateUserAvatarService();

    const updatedUser = await updateAvatar.execute({
      user_id: request.user.id,
      avatar_filename: request.file.filename,
    });

    return response.json(updatedUser);
  },
);

export default usersRouter;
